import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema(
  {

    isDelivered: {
      type: Boolean,
    },
    idClient: {
      type: String,
    },
    ticketNumber: {
      type: String,
    },
    idGroup: {
      type: String,
    },
    idSession: {
      type: String,
    },
    createdAt: {
      type: Date,
    },
    updatedAt: {
      type: Date,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
