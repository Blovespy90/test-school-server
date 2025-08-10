import { ErrorWithStatus } from '@/classes/ErrorWithStatus';
import { QueryBuilder } from '@/classes/QueryBuilder';
import { Competency } from '@/modules/competency/competency.model';
import type { ICompetency } from '@/modules/competency/competency.types';
import { STATUS_CODES } from 'nhb-toolbox/constants';

const createCompetencyInDB = async (payload: ICompetency) => {
	const newCompetency = await Competency.create(payload);

	return newCompetency;
};

const getAllCompetenciesFromDB = async (query?: Record<string, unknown>) => {
	const competencyQuery = new QueryBuilder(Competency.find(), query).sort();
	// const competencies = await Competency.find({});

	const competencies = await competencyQuery.modelQuery;

	return competencies;
};

const getSingleCompetencyFromDB = async (id: string) => {
	const competency = await Competency.findCompetencyById(id);

	return competency;
};

const updateCompetencyInDB = async (id: string, payload: Partial<ICompetency>) => {
	const updatedCompetency = await Competency.findOneAndUpdate({ _id: id }, payload, {
		runValidators: true,
		new: true,
	});

	if (!updatedCompetency) {
		throw new ErrorWithStatus(
			'Not Updated Error',
			`Cannot update specified competency with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'update_competency'
		);
	}

	return updatedCompetency;
};

const deleteCompetencyFromDB = async (id: string) => {
	const result = await Competency.deleteOne({ _id: id });

	if (result.deletedCount < 1) {
		throw new ErrorWithStatus(
			'Delete Failed Error',
			`Failed to delete competency with ID ${id}!`,
			STATUS_CODES.INTERNAL_SERVER_ERROR,
			'delete_competency'
		);
	}
};

export const competencyServices = {
	createCompetencyInDB,
	getAllCompetenciesFromDB,
	getSingleCompetencyFromDB,
	updateCompetencyInDB,
	deleteCompetencyFromDB,
};
