const mongoose = require("mongoose");
const httpStatus = require("http-status");
const moment = require("moment-timezone");
const APIError = require("../utils/error");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    grups: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Grup",
      },
    ],
  },
  {
    timestamps: true,
  }
);

userSchema.method({
  jsonObject() {
    const object = {};
    const fields = ["id", "name", "surname", "grups", "createdAt"];

    fields.forEach((field) => {
      object[field] = this[field];
    });

    return object;
  },
});

userSchema.statics = {
  async list({ page = 1, perPage = 10, search }) {
    let match = {};
    page = parseInt(page);
    perPage = parseInt(perPage);

    if (search) {
      match["$or"] = [
        { name: RegExp(search, "i") },
        { surname: RegExp(search, "i") },
      ];
    }

    try {
      let pipeline = [
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            surname: 1,
            grups: 1,
            createdAt: 1,
          },
        },
        {
          $match: match,
        },
        { $sort: { createdAt: 1 } },
        { $skip: perPage * (page - 1) },
      ];

      if (perPage > 0) {
        pipeline.push({ $limit: parseInt(perPage) });
      }

      let users = await this.aggregate(pipeline);
      let total = await this.countDocuments(match).exec();

      return { users, total, page, perPage };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = mongoose.model("User", userSchema);
