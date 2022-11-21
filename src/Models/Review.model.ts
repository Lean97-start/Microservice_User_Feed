import { Schema, model } from "mongoose";
import { Review } from "../interface/reviewModel";

const review = new Schema <Review>(
    {
        _id_user: {
            type: String,
            required: true
        },
        _id_article: {
            type: String,
            required: true
        },
        review_descript: {
            type: String,
            required: true
        },
        score: {
            type: Number
        }
    },
    {
        timestamps: true,
        versionKey: false
    }
);

const Review = model('Review', review);
