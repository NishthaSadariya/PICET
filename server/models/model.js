const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const sequelize = new Sequelize('picet', 'root', 'Nishtha@2005', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const User = sequelize.define("User", {
    uid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    name: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("admin", "evaluator"), allowNull: false },
    domain: { type: DataTypes.STRING, allowNull: true },
    approval_status: { type: DataTypes.ENUM("pending", "approved", "rejected"), defaultValue: "pending" },
    createdAt: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    resetPasswordToken: { type: DataTypes.STRING, allowNull: true },
    resetPasswordExpires: { type: DataTypes.DATE, allowNull: true },
}, {
    tableName: "users",
    timestamps: false
});



const ResearchPaper = sequelize.define('ResearchPaper', {
    rid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    author_name: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    post_date: { type: DataTypes.DATE, defaultValue: Sequelize.NOW },
    paper_file: { type: DataTypes.STRING, allowNull: false },
    domain: { type: DataTypes.STRING, allowNull: false }
}, {
    tableName: 'research_papers',
    timestamps: false
});

const EvaluatorAssignment = sequelize.define('EvaluatorAssignment', {
    eaid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rid: { type: DataTypes.INTEGER, allowNull: false, references: { model: ResearchPaper, key: 'rid' } },
    uid: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'uid' } },
    session_start: { type: DataTypes.STRING, allowNull: true },
    session_end: { type: DataTypes.STRING, allowNull: true }
}, {
    tableName: 'evaluator_assignments',
    timestamps: false
});


const ResearchPaperRating = sequelize.define('ResearchPaperRating', {
    rprid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    rid: { type: DataTypes.INTEGER, allowNull: false, references: { model: ResearchPaper, key: 'rid' } },
    uid: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'uid' } },
    q1: { type: DataTypes.INTEGER, validate: { min: 0, max: 5 } },
    q2: { type: DataTypes.INTEGER, validate: { min: 0, max: 5 } },
    q3: { type: DataTypes.INTEGER, validate: { min: 0, max: 5 } },
    q4: { type: DataTypes.INTEGER, validate: { min: 0, max: 5 } },
    q5: { type: DataTypes.INTEGER, validate: { min: 0, max: 5 } }
}, {
    tableName: 'research_paper_ratings',
    timestamps: false
});


const TopThreePapers = sequelize.define('TopThreePapers', {
    tpid: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    evaluator_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: User, key: 'uid' } },
    rid1: { type: DataTypes.INTEGER, allowNull: false, references: { model: ResearchPaper, key: 'rid' } },
    rid2: { type: DataTypes.INTEGER, allowNull: true, references: { model: ResearchPaper, key: 'rid' } }, // Allow null
    rid3: { type: DataTypes.INTEGER, allowNull: true, references: { model: ResearchPaper, key: 'rid' } }  // Allow null
}, {
    tableName: 'top_three_papers',
    timestamps: false
});


User.hasMany(EvaluatorAssignment, { foreignKey: 'uid' });
EvaluatorAssignment.belongsTo(User, { foreignKey: 'uid' });

ResearchPaper.hasMany(EvaluatorAssignment, { foreignKey: 'rid' });
EvaluatorAssignment.belongsTo(ResearchPaper, { foreignKey: 'rid' });

User.hasMany(ResearchPaperRating, { foreignKey: 'uid' });
ResearchPaperRating.belongsTo(User, { foreignKey: 'uid' });

ResearchPaper.hasMany(ResearchPaperRating, { foreignKey: 'rid' });
ResearchPaperRating.belongsTo(ResearchPaper, { foreignKey: 'rid' });

sequelize.sync({ alter: false })
    .then(() => console.log("Database & tables checked!"))
    .catch(error => console.error("Error syncing database: ", error));

module.exports = { User, ResearchPaper, EvaluatorAssignment, ResearchPaperRating, TopThreePapers, sequelize };