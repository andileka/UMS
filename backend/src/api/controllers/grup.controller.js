const httpStatus = require("http-status");
const Grup = require("../models/grup.model");
const User = require("../models/user.model");
const APIError = require("../utils/error");

exports.load = async (req, res, next, id) => {
  try {
    const grup = await Grup.findById(id).populate("users");

    if (!grup) {
      throw new APIError({
        message: "grup does not exist",
        status: httpStatus.NOT_FOUND,
      });
    }

    req.locals = { grup };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json(req.locals.grup.jsonObject());

exports.create = async (req, res, next) => {
  try {
    const existing = await Grup.findOne({ name: req.body.name }).exec();
    if (existing) {
      throw new APIError({
        message: "Name already exists",
        status: httpStatus.BAD_REQUEST,
      });
    }

    const grup = new Grup(req.body);
    const savedGrup = await grup.save();
    res.status(httpStatus.CREATED);
    res.json(savedGrup.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.name !== req.locals.grup.name) {
      const existing = await Grup.findOne({ name: req.body.name }).exec();
      if (existing) {
        throw new APIError({
          message: "name already exists",
          status: httpStatus.BAD_REQUEST,
        });
      }
    }

    const grup = Object.assign(req.locals.grup, req.body);

    const savedGrup = await grup.save();
    res.json(savedGrup.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let grups = await Grup.list(req.query);

    res.json(grups);
  } catch (error) {
    next(error);
  }
};

exports.listForGrup = async (req, res, next) => {
  try {
    let { grup } = req.locals;

    let grups = await grup.listForGrup({
      ...req.query,
      grupId: grup.id,
    });
    res.json(grups);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const id = req.params.grupId;
  try {
    await Grup.deleteOne({ _id: id });
    res.json(id);
  } catch (e) {
    next(e);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.name !== req.grup.name) {
      const existing = await grup.findOne({ name: req.body.name }).exec();
      if (existing) {
        throw new APIError({
          message: "name already exists",
          status: httpStatus.BAD_REQUEST,
        });
      }
    }

    const grup = Object.assign(req.grup, req.body);

    const savedGrup = await grup.save();
    res.json(savedGrup.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.addUserToGrup = async (req, res, next) => {
  try {
    let userToGrups = await Grup.findByIdAndUpdate(
      req.body.grupId,
      { $push: { users: req.body.userId } },
      { new: true, useFindAndModify: false }
    );
    await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { grups: req.body.grupId } },
      { new: true, useFindAndModify: false }
    );
    res.json(userToGrups);
  } catch (error) {
    next(error);
  }
};

exports.removeUserFromGrup = async (req, res, next) => {
  console.log(req.body);
  try {
    let userToGrups = await User.findByIdAndUpdate(req.body.userId, {
      $pull: { grups: req.body.grupId },
    });
    await Grup.findByIdAndUpdate(req.body.grupId, {
      $pull: { users: req.body.userId },
    });
    res.json(userToGrups);
  } catch (error) {
    next(error);
  }
};

exports.getEdditableUsersForGrup = async (req, res, next) => {
  try {
    const users = await User.find({ grups: { $ne: req.params.grupId } });

    if (!users) {
      throw new APIError({
        message: "all users are edit to this grup",
        status: httpStatus.NOT_FOUND,
      });
    }

    res.json(users);
  } catch (error) {
    return next(error);
  }
};
