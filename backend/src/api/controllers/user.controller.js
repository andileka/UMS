const httpStatus = require("http-status");
const { omit } = require("lodash");
const User = require("../models/user.model");
const APIError = require("../utils/error");
const Grup = require("../models/grup.model");

exports.load = async (req, res, next, id) => {
  try {
    const user = await User.findById(id).populate("grups");

    if (!user) {
      throw new APIError({
        message: "User does not exist",
        status: httpStatus.NOT_FOUND,
      });
    }

    req.locals = { user };
    return next();
  } catch (error) {
    return next(error);
  }
};

exports.get = (req, res) => res.json(req.locals.user.jsonObject());

exports.create = async (req, res, next) => {
  try {
    const existing = await User.findOne({ name: req.body.name }).exec();
    if (existing) {
      throw new APIError({
        message: "Name already exists",
        status: httpStatus.BAD_REQUEST,
      });
    }

    const user = new User(req.body);
    const savedUser = await user.save();

    await User.findByIdAndUpdate(
      savedUser._id,
      { $push: { grups: req.body.grupId } },
      { new: true, useFindAndModify: false }
    );
    await Grup.findByIdAndUpdate(
      req.body.grupId,
      { $push: { users: savedUser._id } },
      { new: true, useFindAndModify: false }
    );

    res.status(httpStatus.CREATED);
    res.json(savedUser.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (req.body.email !== req.locals.user.email) {
      const existing = await User.findOne({ email: req.body.email }).exec();
      if (existing) {
        throw new APIError({
          message: "Email already exists",
          status: httpStatus.BAD_REQUEST,
        });
      }
    }

    const user = Object.assign(req.locals.user, req.body);

    const savedUser = await user.save();
    res.json(savedUser.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.list = async (req, res, next) => {
  try {
    let users = await User.list(req.query);

    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.listForGrup = async (req, res, next) => {
  try {
    let { grup } = req.locals;

    let users = await User.listForGrup({
      ...req.query,
      grupId: grup.id,
    });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

exports.remove = async (req, res, next) => {
  const { user } = req.locals;
  try {
    await user.remove();
    res.status(httpStatus.NO_CONTENT).end();
  } catch (error) {
    next(error);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
    if (req.body.name !== req.user.name) {
      const existing = await User.findOne({ name: req.body.name }).exec();
      if (existing) {
        throw new APIError({
          message: "name already exists",
          status: httpStatus.BAD_REQUEST,
        });
      }
    }

    const user = Object.assign(req.user, req.body);

    const savedUser = await user.save();
    res.json(savedUser.jsonObject());
  } catch (error) {
    next(error);
  }
};

exports.addGrupToUser = async (req, res, next) => {
  try {
    let grupToUsers = await User.findByIdAndUpdate(
      req.body.userId,
      { $push: { grups: req.body.grupId } },
      { new: true, useFindAndModify: false }
    );
    await Grup.findByIdAndUpdate(
      req.body.grupId,
      { $push: { users: req.body.userId } },
      { new: true, useFindAndModify: false }
    );
    res.json(grupToUsers);
  } catch (error) {
    next(error);
  }
};

exports.removeGrupFromUser = async (req, res, next) => {
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

exports.getEdditableGrupsForUser = async (req, res, next) => {
  try {
    const grups = await Grup.find({ users: { $ne: req.params.userId } });

    if (!grups) {
      throw new APIError({
        message: "all grups are edit to this user",
        status: httpStatus.NOT_FOUND,
      });
    }

    res.json(grups);
  } catch (error) {
    return next(error);
  }
};
