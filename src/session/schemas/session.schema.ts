import * as mongoose from 'mongoose';

export const SessionSchema = new mongoose.Schema(
  {
    startDate: {
      type: String, 
      required: [true, 'FROM_DATE_IS_BLANK'],
    },
    endDate: {
      type: String,
      required: [true, 'END_DATE_IS_BLANK'],
    },
    description: {
      minlength: 6,
      maxlength: 255,
      type: String,
    },
    name: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: [true, 'NAME_IS_BLANK'],
    },
    limitTicket: {
      type: Number,
      required: [true, 'LIMIT_TICKET_IS_BLANK'],

    },
    isCurrent: {
      type: Boolean,
      default: false,

    },
    winner: {
      type: String

    },
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
