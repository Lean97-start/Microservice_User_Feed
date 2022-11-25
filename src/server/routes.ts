'use strict';
import express from 'express';
import { addReportReview } from '../Controller/Report.controller';
import { addReviewArticle, deleteReviewArticle, modifyReviewArticle } from '../Controller/Review.controller';

const router = express.Router();

router.post('/v1/reviews/createReview', addReviewArticle);
router.post('/v1/reviews/modifyReview', modifyReviewArticle);
router.post('/v1/reviews/deleteReview', deleteReviewArticle);
router.post('/v1/reviews/reportReview', addReportReview);

export {router};

