'use strict';
import express from 'express';
import { validationToken } from '../Middleware/Token';
import { ConsultArticleBought } from '../Controller/Review.controller';

const router = express.Router();

router.post('/v1/reviews/consultUserArticleBought', ConsultArticleBought);
// router.post('/v1/reviews/createReview',  );
// router.post('/v1/reviews/modifyReview',  );
// router.post('/v1/reviews/deleteReview',  );
// router.post('/v1/reviews/reportReview',  )

export {router};

