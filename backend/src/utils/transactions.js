/**
 * Utilidades para transacciones de MongoDB
 * Proporciona funciones helper para operaciones que requieren atomicidad
 */

const mongoose = require('mongoose');

/**
 * Ejecuta una operación dentro de una transacción
 * @param {Function} callback - Función que contiene las operaciones a ejecutar
 * @returns {Promise} - Resultado de la operación
 */
const executeTransaction = async (callback) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const result = await callback(session);
    await session.commitTransaction();
    return result;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Crea una orden sin marcar la obra como vendida.
 * La venta se confirma únicamente tras webhook de pago exitoso.
 * @param {Object} orderData - Datos de la orden
 * @param {string} artworkId - ID de la obra
 * @param {number} commissionPercentage - Porcentaje de comisión
 * @returns {Promise<Object>} - Orden creada
 */
const createOrderWithArtworkUpdate = async (orderData, artworkId, commissionPercentage) => {
  const { Order, Artwork } = require('../models');

  return await executeTransaction(async (session) => {
    // Verificar que la obra existe y está disponible
    const artwork = await Artwork.findById(artworkId).session(session);
    
    if (!artwork) {
      throw new Error('Obra no encontrada');
    }

    if (artwork.status !== 'published') {
      throw new Error('La obra no está disponible para la venta');
    }

    // Calcular comisión
    const commission = Math.round((orderData.price * commissionPercentage / 100) * 100) / 100;
    const artistEarnings = Math.round((orderData.price - commission) * 100) / 100;

    // Crear orden
    const order = await Order.create([{
      ...orderData,
      commission,
      artistEarnings,
    }], { session });

    return order[0];
  });
};

/**
 * Acepta un encargo y actualiza el estado de forma atómica
 * @param {string} commissionId - ID del encargo
 * @param {number} agreedPrice - Precio acordado (opcional)
 * @returns {Promise<Object>} - Encargo actualizado
 */
const acceptCommissionRequest = async (commissionId, agreedPrice = null) => {
  const { CommissionRequest } = require('../models');

  return await executeTransaction(async (session) => {
    const commission = await CommissionRequest.findById(commissionId).session(session);

    if (!commission) {
      throw new Error('Encargo no encontrado');
    }

    if (commission.status !== 'pending') {
      throw new Error('El encargo no está en estado pendiente');
    }

    commission.status = 'accepted';
    if (agreedPrice !== null) {
      commission.agreedPrice = agreedPrice;
    } else {
      commission.agreedPrice = commission.budget;
    }

    await commission.save({ session });
    return commission;
  });
};

/**
 * Completa un encargo y crea una orden asociada de forma atómica
 * @param {string} commissionId - ID del encargo
 * @param {Object} orderData - Datos para crear la orden
 * @param {number} commissionPercentage - Porcentaje de comisión
 * @returns {Promise<Object>} - Orden creada
 */
const completeCommissionWithOrder = async (commissionId, orderData, commissionPercentage) => {
  const { CommissionRequest, Order } = require('../models');

  return await executeTransaction(async (session) => {
    const commission = await CommissionRequest.findById(commissionId).session(session);

    if (!commission) {
      throw new Error('Encargo no encontrado');
    }

    if (commission.status !== 'in_progress') {
      throw new Error('El encargo debe estar en progreso para completarse');
    }

    // Calcular comisión basada en el precio acordado
    const finalPrice = commission.agreedPrice || commission.budget;
    const commissionAmount = Math.round((finalPrice * commissionPercentage / 100) * 100) / 100;
    const artistEarnings = Math.round((finalPrice - commissionAmount) * 100) / 100;

    // Crear orden
    const order = await Order.create([{
      ...orderData,
      price: finalPrice,
      commission: commissionAmount,
      artistEarnings,
    }], { session });

    // Marcar encargo como completado
    commission.status = 'completed';
    await commission.save({ session });

    return order[0];
  });
};

module.exports = {
  executeTransaction,
  createOrderWithArtworkUpdate,
  acceptCommissionRequest,
  completeCommissionWithOrder,
};
