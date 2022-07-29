import * as mongoose from 'mongoose';

export const GroupSchema = new mongoose.Schema(
  {
    description: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: [true, 'DESCRITION_IS_BLANK'],
    },
    percentage: {
      type: Number,
      required: [true, 'PERCENTAGE_IS_BLANK'],
    }, 
    limitTicket: {
      type: Number,
    }
  },
  {
    versionKey: false,
    timestamps: true,
  },
);
