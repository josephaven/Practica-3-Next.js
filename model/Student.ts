import { Schema, model, models, Model, Types, HydratedDocument } from "mongoose";

export interface Student {
    nombre: string;
    apellido: string;
    matricula: string;
    carrera: string;
}

export interface StudentDoc extends Student {
    id: string;              // expuesto
    createdAt: Date;
    updatedAt: Date;
    _id: Types.ObjectId;     // interno de mongoose
}

const studentSchema = new Schema<StudentDoc>(
    {
        nombre: { type: String, required: true },
        apellido: { type: String, required: true },
        matricula: { type: String, required: true, unique: true },
        carrera: { type: String, required: true },
    },
    { timestamps: true }
);

// virtual "id" (sirve también con .lean({ virtuals:true }))
studentSchema.virtual("id").get(function (this: StudentDoc) {
    return this._id.toString();
});

type RetShape = Partial<StudentDoc> & { _id?: Types.ObjectId; id?: string };

studentSchema.set("toJSON", {
    virtuals: true,
    versionKey: false,
    transform: (_doc: HydratedDocument<StudentDoc>, ret: RetShape) => {
        ret.id = ret.id ?? (ret._id ? ret._id.toString() : undefined);
        delete ret._id;
        return ret;
    },
});

export const Student: Model<StudentDoc> =
    (models.Student as Model<StudentDoc>) ?? model<StudentDoc>("Student", studentSchema);
