const mongoose = require("mongoose");
const httpStatus = require("http-status");
const moment = require("moment-timezone");
const APIError = require("../utils/error");

const grupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

grupSchema.pre("save", async function save(next) {
  try {
    if (!this.isModified("password")) return next();
    const hash = await bcrypt.hash(this.password, 1);
    this.password = hash;

    return next();
  } catch (error) {
    return next(error);
  }
});

grupSchema.method({
  jsonObject() {
    const object = {};
    const fields = ["id", "name", "description", "users", "createdAt"];

    fields.forEach((field) => {
      object[field] = this[field];
    });

    return object;
  },
});

grupSchema.statics = {
  async list({ page = 1, perPage = 10, search }) {
    let match = {};
    page = parseInt(page);
    perPage = parseInt(perPage);

    if (search) {
      match["$or"] = [
        { name: RegExp(search, "i") },
        { description: RegExp(search, "i") },
      ];
    }

    try {
      let pipeline = [
        {
          $project: {
            _id: 0,
            id: "$_id",
            name: 1,
            description: 1,
            users: 1,
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

      let grups = await this.aggregate(pipeline);
      let total = await this.countDocuments(match).exec();

      return { grups, total, page, perPage };
    } catch (error) {
      throw error;
    }
  },
};

module.exports = mongoose.model("Grup", grupSchema);
