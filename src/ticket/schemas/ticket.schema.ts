import * as mongoose from 'mongoose';


export const TicketSchema = new mongoose.Schema({
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
    id_client: {
        type: Number,
        required: [false, 'CLIENT_IS_BLANK'],
    },
}, {
    versionKey: false,
    timestamps: true,
});