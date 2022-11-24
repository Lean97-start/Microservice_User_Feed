'use strict';
import express from 'express';
import { addReviewArticle, ConsultArticleBought, deleteReviewArticle, modifyReviewArticle } from '../Controller/Review.controller';

const router = express.Router();

router.post('/v1/reviews/consultUserArticleBought', ConsultArticleBought);
router.post('/v1/reviews/createReview', addReviewArticle);
router.post('/v1/reviews/modifyReview', modifyReviewArticle);
router.post('/v1/reviews/deleteReview',  deleteReviewArticle);
router.post('/v1/reviews/reportReview',  )

export {router};

