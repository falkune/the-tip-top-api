import * as mongoose from 'mongoose';
import * as validator from 'validator';
import * as bcrypt from 'bcrypt'; 

export const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      minlength: 6,
      maxlength: 255,
      required: [true, 'NAME_IS_BLANK'],
    },
    email: {
      type: String,
      lowercase: true,
      validate: validator.isEmail,
      maxlength: 255,
      minlength: 6,
      required: [true, 'EMAIL_IS_BLANK'],
    },
    password: {
      type: String,
      minlength: 5,
      maxlength: 1024,
      required: [false, 'PASSWORD_IS_BLANK'],
    },

    userLocation: {
      type: Object,
     
    },
    socialToken: {
      type: String
    }, 
    socialAccessToken: {
      type: String
    }, 
    socialProvider: {
      type: String
    }, 
    roles: {
      type: [String],
      default: ['client'],
    },
    birthday: {
      type: String,
    },
    verification: {
      type: String,
      validate: validator.isUUID,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    verificationExpires: {
      type: Date,
      default: Date.now,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    blockExpires: {
      type: Date,
      default: Date.now,
    },

    createdAt    : { type: Date},
  },
 

  {
    versionKey: false,
    timestamps: { updatedAt: true},}
  
);


// UserSchema.pre('save', async function(next: mongoose.HookNextFunction) {
UserSchema.pre('save', async function (next) {
  

  try {
    if (!this.isModified('password')) {
      return next();
    }
    // tslint:disable-next-line:no-string-literal
    const hashed = await bcrypt.hash(this['password'], 10);
    // tslint:disable-next-line:no-string-literal
    this['password'] = hashed; 
    return next();
  } catch (err) {
    return next(err);
  }
});
