import * as mongoose from 'mongoose';

export const TicketSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: [true, 'TITLE_IS_BLANK'],
    },
    body: {
      type: String,
      required: [true, 'BODY_IS_BLANK'],
    },
    idClient: {
      type: String,
    },
    ticketNumber: {
      type: Number,
    },
    idGroup: {
      type: String,
    },
    idSession: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
