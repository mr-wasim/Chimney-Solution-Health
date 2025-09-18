import mongoose from 'mongoose'

const ReportSchema = new mongoose.Schema(
  {
    clientName: { type: String, required: true },
    clientNumber: { type: String, required: true },
    product: { type: String, required: true },

    initialScore: { type: Number, default: 100 },
    visits: { type: Number, default: 0 },
    renewals: { type: Number, default: 0 }, // added for future tracking
    cleaningType: { type: String, enum: ['basic', 'deep', 'premium'], default: 'basic' },

    notes: { type: String, default: '' },
    lastServiceDate: { type: Date, default: null },
  },
  { timestamps: true }
)

export default mongoose.models.Report || mongoose.model('Report', ReportSchema)
