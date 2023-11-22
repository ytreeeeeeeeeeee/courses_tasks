import Advertisment from '../models/advertisment.js';

const find = async (queryParams) => {
    try {
        queryParams.isDeleted = false;

        if (queryParams.shortTitle !== undefined) {
            queryParams.shortTitle = { $regex: new RegExp(queryParams.shortTitle, 'i') };
        }

        if (queryParams.description !== undefined) {
            queryParams.description = { $regex: new RegExp(description, 'i') };
        }

        if (queryParams.tags !== undefined && queryParams.tags.length > 0) {
            queryParams.tags = { $all: queryParams.tags };
        }

        const advertisments = await Advertisment.find(queryParams).populate('userId', '_id name').select('-updatedAt -tags -isDeleted').lean();

        advertisments.forEach(element => {
            element.user = element.userId;
            delete element.userId;            
        });

        return advertisments || null;
    } catch (e) {
        throw e;
    }
};

const create = async({shortTitle, description, userId, images, tags}) => {
    try {
        const newAdvertisment = new Advertisment({
            shortTitle,
            description,
            images,
            userId,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            tags,
        });

        await newAdvertisment.save();

        const advertisment = await Advertisment.findById(newAdvertisment._id).populate('userId', '_id name').select('-updatedAt -tags -isDeleted').lean();
        advertisment.user = advertisment.userId;
        delete advertisment.userId;     

        return advertisment;
    } catch (e) {
        throw e;
    }
};

const remove = async (id) => {
    try {
        await Advertisment.findByIdAndUpdate(id, { isDeleted: true });
    } catch (e) {
        throw e;
    }
};

const AdvertisementModule = {
    create,
    find,
    remove,
};

export default AdvertisementModule;