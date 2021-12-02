import { getConnection, getRepository, QueryRunner, Repository } from "typeorm";

import { Answer } from "../entity/answer";
import { HashTag } from "../entity/hashtag";
import { Question } from "../entity/question";
import { QuestionLike } from "../entity/question_like";
import { AnswerLike } from "../entity/answer_like";
import { length } from "class-validator";
import { QuestionDetail } from "../definition/response_data";
import { AnswerDetail } from "../definition/response_data";

export class PageService {
	private questionRepository: Repository<Question>;
	private hashtagRepository: Repository<HashTag>;
	private questionLikeRepository: Repository<QuestionLike>;
	private answerLikeRepository: Repository<AnswerLike>;

	constructor() {
		this.questionRepository = getConnection().getRepository(Question);
		this.hashtagRepository = getConnection().getRepository(HashTag);
		this.questionLikeRepository = getConnection().getRepository(QuestionLike);
		this.answerLikeRepository = getConnection().getRepository(AnswerLike);
	}

	async setQuestionViewCount(questionId) {
		const questionInfo = await this.questionRepository.findOne({ where: { id: questionId } })
		if (questionInfo === undefined) {
			throw new Error("The questionPost doesn't exist.");
		}
		questionInfo.view_count = questionInfo.view_count + 1;
		await this.questionRepository.save(questionInfo);
	}

	async getQuestionDetail(questionId, userId) {

		const subQuery = await this.questionRepository
			.createQueryBuilder('covers')
			.select(['covers.id'])
			.where('covers.id = :questionId', { questionId })

		const questionInfo = await this.questionRepository
			.createQueryBuilder('question')
			.innerJoin(`(${subQuery.getQuery()})`, 'covers',
				'question.id = covers.covers_id')
			.setParameters(subQuery.getParameters())
			// .andWhere('question_like_user.id = :question_like_userId', {question_like_userId:userId})
			// .andWhere('answer_like_user.id = :answer_like_userId', {answer_like_userId:userId})
			.leftJoin('question.hashtag', 'hashtag')
			.leftJoin('question.user', 'question_user')
			.leftJoin('question.comment', 'question_comment')
			.leftJoin('question.answer', 'answer')
			.leftJoin('answer.comment', 'answer_comment')
			.leftJoin('answer.user', 'answer_user')
			.leftJoin('question_comment.user', 'question_comment_user')
			.leftJoin('answer_comment.user', 'answer_comment_user')
			.leftJoin('question.question_like', 'question_like')
			.leftJoin('question_like.user', 'question_like_user')
			.leftJoin('answer.answer_like', 'answer_like')
			.leftJoin('answer_like.user', 'answer_like_user')
			.select(['question.id', 'question.created_at', 'question.is_solved', 'question.like_count', 'question.view_count', 'question.title', 'question.text',
				'answer.id', 'answer.created_at', 'answer.like_count', 'answer.text', 'answer.is_chosen',
				'question_comment.id', 'question_comment.created_at', 'question_comment.text',
				'answer_comment.id', 'answer_comment.created_at', 'answer_comment.text',
				'question_user.id', 'question_user.created_at', 'question_user.email', 'question_user.nickname', 'question_user.photo',
				'question_comment_user.id', 'question_comment_user.created_at', 'question_comment_user.email', 'question_comment_user.nickname', 'question_comment_user.photo',
				'answer_user.id', 'answer_user.created_at', 'answer_user.email', 'answer_user.nickname', 'answer_user.photo',
				'answer_comment_user.id', 'answer_comment_user.created_at', 'answer_comment_user.email', 'answer_comment_user.nickname', 'answer_comment_user.photo',
				'hashtag.id', 'hashtag.name',
				'question_like.id',
				'answer_like.id'
			])
			.disableEscaping()
			.getOne();
		console.log(questionInfo)
		// const question_like = questionInfo.question_like.filter((like_list) => {
		// 	if (like_list.id == userId)
		// 		return true
		// })
		// const answer_like = [];
		// for (let i = 0; i < questionInfo.answer.length; i++) {
		// 	for (let j = 0; j < questionInfo.answer[i].answer_like.length; j++) {
		// 		// console.log(questionInfo.answer[i].answer_like[j].id)
		// 		if (questionInfo.answer[i].answer_like[j].id == userId)
		// 			answer_like.push(i, true);
		// 	}
		// }
		const questionDetailInfo: QuestionDetail = {
			id: questionInfo.id,
			created_at: questionInfo.created_at,
			updated_at: questionInfo.updated_at,
			user: questionInfo.user,
			answer: [],
			comment: questionInfo.comment,
			hashtag: questionInfo.hashtag,
			question_like: undefined,
			is_solved: questionInfo.is_solved,
			answer_count: questionInfo.answer_count,
			like_count: questionInfo.like_count,
			view_count: questionInfo.view_count,
			title: questionInfo.title,
			text: questionInfo.text,
			is_like: question_like != undefined ? true : null,
		};
		// console.log(questionDetailInfo)
		if (questionInfo.answer) {
			for (let i = 0; i < questionInfo.answer.length; i++) {
				const curAnswer = questionInfo.answer[i];
				const AnswerDetail: AnswerDetail = {
					id: curAnswer.id,
					created_at: curAnswer.created_at,
					updated_at: curAnswer.updated_at,
					question: curAnswer.question,
					user: curAnswer.user,
					comment: curAnswer.comment,
					answer_like: undefined,
					like_count: curAnswer.like_count,
					text: curAnswer.text,
					is_chosen: curAnswer.is_chosen,
					is_like: questionInfo.answer[i].answer_like[0].is_like || false,
				}
				questionDetailInfo.answer.push(AnswerDetail);
			}
		}
		return questionDetailInfo;
	}

	async getQuestionDetailNoAuth(questionId) {

		const subQuery = await this.questionRepository
			.createQueryBuilder('covers')
			.select(['covers.id'])
			.where('covers.id = :questionId', { questionId })

		const questionInfo = await this.questionRepository
			.createQueryBuilder('question')
			.innerJoin(`(${subQuery.getQuery()})`, 'covers',
				'question.id = covers.covers_id')
			.setParameters(subQuery.getParameters())
			.leftJoin('question.hashtag', 'hashtag')
			.leftJoin('question.user', 'question_user')
			.leftJoin('question.comment', 'question_comment')
			.leftJoin('question.answer', 'answer')
			.leftJoin('answer.comment', 'answer_comment')
			.leftJoin('answer.user', 'answer_user')
			.leftJoin('question_comment.user', 'question_comment_user')
			.leftJoin('answer_comment.user', 'answer_comment_user')
			.select(['question.id', 'question.created_at', 'question.is_solved', 'question.like_count', 'question.view_count', 'question.title', 'question.text',
				'answer.id', 'answer.created_at', 'answer.like_count', 'answer.text', 'answer.is_chosen',
				'question_comment.id', 'question_comment.created_at', 'question_comment.text',
				'answer_comment.id', 'answer_comment.created_at', 'answer_comment.text',
				'question_user.id', 'question_user.created_at', 'question_user.email', 'question_user.nickname', 'question_user.photo',
				'question_comment_user.id', 'question_comment_user.created_at', 'question_comment_user.email', 'question_comment_user.nickname', 'question_comment_user.photo',
				'answer_user.id', 'answer_user.created_at', 'answer_user.email', 'answer_user.nickname', 'answer_user.photo',
				'answer_comment_user.id', 'answer_comment_user.created_at', 'answer_comment_user.email', 'answer_comment_user.nickname', 'answer_comment_user.photo',
				'hashtag.id', 'hashtag.name',
			])
			.disableEscaping()
			.getOne();

		const questionDetailInfo: QuestionDetail = {
			id: questionInfo.id,
			created_at: questionInfo.created_at,
			updated_at: questionInfo.updated_at,
			user: questionInfo.user,
			answer: [],
			comment: questionInfo.comment,
			hashtag: questionInfo.hashtag,
			question_like: undefined,
			is_solved: questionInfo.is_solved,
			answer_count: questionInfo.answer_count,
			like_count: questionInfo.like_count,
			view_count: questionInfo.view_count,
			title: questionInfo.title,
			text: questionInfo.text,
			is_like: null,
		};
		if (questionInfo.answer) {
			for (let i = 0; i < questionInfo.answer.length; i++) {
				const curAnswer = questionInfo.answer[i];
				const AnswerDetail: AnswerDetail = {
					id: curAnswer.id,
					created_at: curAnswer.created_at,
					updated_at: curAnswer.updated_at,
					question: curAnswer.question,
					user: curAnswer.user,
					comment: curAnswer.comment,
					answer_like: undefined,
					like_count: curAnswer.like_count,
					text: curAnswer.text,
					is_chosen: curAnswer.is_chosen,
					is_like: null,
				}
				questionDetailInfo.answer.push(AnswerDetail);
			}
		}
		return questionDetailInfo;
	}

	async getQuestionList(pageInfo) {

		const subQuery = await this.questionRepository
			.createQueryBuilder('covers')
			.select(['covers.id'])
			.addOrderBy('covers.id', 'DESC')
			.limit(pageInfo.limit)
			.offset(pageInfo.offset)

		const questionList = await this.questionRepository
			.createQueryBuilder('question')
			.innerJoin(`(${subQuery.getQuery()})`, 'covers',
				'question.id = covers.covers_id')
			.innerJoinAndSelect('question.user', 'question_user')
			.leftJoin('question.hashtag', 'question_hashtag')
			.select(['question.id', 'question.created_at', 'question.is_solved', 'question.like_count', 'question.view_count', 'question.answer_count', 'question.title', 'question.text',
				'question_user.id', 'question_user.created_at', 'question_user.email', 'question_user.nickname', 'question_user.photo',
				'question_hashtag.id', 'question_hashtag.name'
			])
			.getMany();

		const questionCount = await this.questionRepository
			.count();
		return { questionList, questionCount };
	}

	async getQuestionListOrderByLikeCount(pageInfo) {
		const subQuery = await this.questionRepository
			.createQueryBuilder('covers')
			.select(['covers.id', 'covers.like_count'])
			.orderBy('covers.like_count', 'DESC')
			.addOrderBy('covers.id', 'DESC')
			.limit(pageInfo.limit)
			.offset(pageInfo.offset)

		const questionList = await this.questionRepository
			.createQueryBuilder('question')
			.innerJoin(`(${subQuery.getQuery()})`, 'covers',
				'question.id = covers.covers_id')
			.innerJoinAndSelect('question.user', 'question_user')
			.leftJoin('question.hashtag', 'question_hashtag')
			.select(['question.id', 'question.created_at', 'question.is_solved', 'question.like_count', 'question.view_count', 'question.answer_count', 'question.title', 'question.text',
				'question_user.id', 'question_user.created_at', 'question_user.email', 'question_user.nickname', 'question_user.photo',
				'question_hashtag.id', 'question_hashtag.name'
			])
			.getMany();

		const questionCount = await this.questionRepository
			.count();
		return { questionList, questionCount };
	}

	async getQuestionListUnsolved(pageInfo) {
		const subQuery = await this.questionRepository
			.createQueryBuilder('covers')
			.select(['covers.id', 'covers.like_count'])
			.where('covers.is_solved = :is_solved', { is_solved: false })
			.orderBy('covers.id', 'DESC')
			.limit(pageInfo.limit)
			.offset(pageInfo.offset)

		const questionList = await this.questionRepository
			.createQueryBuilder('question')
			.innerJoin(`(${subQuery.getQuery()})`, 'covers',
				'question.id = covers.covers_id')
			.setParameters(subQuery.getParameters())
			.innerJoinAndSelect('question.user', 'question_user')
			.leftJoin('question.hashtag', 'question_hashtag')
			.select(['question.id', 'question.created_at', 'question.is_solved', 'question.like_count', 'question.view_count', 'question.answer_count', 'question.title', 'question.text',
				'question_user.id', 'question_user.created_at', 'question_user.email', 'question_user.nickname', 'question_user.photo',
				'question_hashtag.id', 'question_hashtag.name'
			])
			.getMany();

		const questionCount = await this.questionRepository
			.createQueryBuilder('question')
			.where('question.is_solved = :is_solved', { is_solved: false })
			.getCount();
		return { questionList, questionCount };
	}

	async getQuestionListByKeyword(pageInfo) {
		const subQuery = await this.questionRepository
			.createQueryBuilder('covers')
			.select(['covers.id'])
			.where('covers.title like :title', { title: `%${pageInfo.keyword}%` })
			.orderBy('covers.id', 'DESC')
			.limit(pageInfo.limit)
			.offset(pageInfo.offset)

		const questionList = await this.questionRepository
			.createQueryBuilder('question')
			.innerJoin(`(${subQuery.getQuery()})`, 'covers',
				'question.id = covers.covers_id')
			.setParameters(subQuery.getParameters())
			.innerJoinAndSelect('question.user', 'question_user')
			.leftJoin('question.hashtag', 'question_hashtag')
			.select(['question.id', 'question.created_at', 'question.is_solved', 'question.like_count', 'question.view_count', 'question.answer_count', 'question.title', 'question.text',
				'question_user.id', 'question_user.created_at', 'question_user.email', 'question_user.nickname', 'question_user.photo',
				'question_hashtag.id', 'question_hashtag.name'
			])
			.getMany();

		const questionCount = await this.questionRepository
			.createQueryBuilder('question')
			.where('question.title like :title', { title: `%${pageInfo.keyword}%` })
			.getCount();
		return { questionList, questionCount }
	}
}
