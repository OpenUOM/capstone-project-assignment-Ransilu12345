const dbConnection = require("./sqlite");

dbConnection
  .getDbConnection()
  .then((db) => {
    init(db);
  })
  .catch((err) => {
    console.log(err);
    throw err;
  });

let _db;

function init(db) {
    _db = db;
}

const knex_db = require("./db-config");
const testBase = require("./testBase");

const dbinitialize = async () => {
  try {
    await testBase.resetDatabase(knex_db);
    console.log("Database reset successfully");
    return { status: "Database initialized successfully" };
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
};


const readTeachers = async () => {
    const sql = `SELECT * FROM teacher`
    return new Promise((resolve, reject) => {
        knex_db
            .raw(sql)
            .then((teachers) => {
                resolve(teachers);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const readTeacherInfo = async (id) => {
    const sql = `SELECT * FROM teacher WHERE id = ?`
    return new Promise((resolve, reject) => {
        knex_db
            .raw(sql, [id])
            .then((teacher) => {
                resolve(teacher);
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const addTeacher = async (id, name, age) => {
    const sql = `INSERT INTO teacher(id,name,age) values (?, ?, ?)`
    return new Promise((resolve, reject) => {
        knex_db
            .raw(sql, [id, name, age])
            .then(() => {
                resolve({status: "Successfully inserted Teacher"})
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const updateTeacher = async (name, age, id) => {
    const sql = `UPDATE teacher SET name=?, age=? WHERE id=?`
    return new Promise((resolve, reject) => {
        knex_db
            .raw(sql, [name, age, id])
            .then(() => {
                resolve({status: "Successfully updated Teacher"})
            })
            .catch((error) => {
                reject(error);
            });
    });
}

const deleteTeacher = async (id) => {
    const sql = `DELETE FROM teacher WHERE id = ?`
    return new Promise((resolve, reject) => {
        knex_db
            .raw(sql, [id])
            .then(() => {
                resolve({status: "Successfully deleted Teacher"})
            })
            .catch((error) => {
                reject(error);
            });
    });
}


const readStudents = async () => {
  const sql = `SELECT * FROM student`;
  return knex_db.raw(sql);
};

const readStudentInfo = async (id) => {
  const sql = `SELECT * FROM student WHERE id = ?`;
  return knex_db.raw(sql, [id]);
};

const addStudent = async (id, name, age, hometown) => {
  const sql = `INSERT INTO student (id, name, age, hometown) VALUES (?, ?, ?, ?)`;
  return knex_db
    .raw(sql, [id, name, age, hometown])
    .then(() => ({ status: "Successfully inserted Student" }))
    .catch((error) => {
      console.error("Error adding student:", error);
      throw error;
    });
};

const updateStudent = async (name, age, hometown, id) => {
  const sql = `UPDATE student SET name = ?, age = ?, hometown = ? WHERE id = ?`;
  return knex_db
    .raw(sql, [name, age, hometown, id])
    .then(() => ({ status: "Successfully updated Student" }))
    .catch((error) => {
      console.error("Error updating student:", error);
      throw error;
    });
};

const deleteStudent = async (id) => {
  const sql = `DELETE FROM student WHERE id = ?`;
  return knex_db
    .raw(sql, [id])
    .then(() => ({ status: "Successfully deleted Student" }))
    .catch((error) => {
      console.error("Error deleting student:", error);
      throw error;
    });
};


module.exports = {
    readTeachers,
    readStudents,
    addStudent,
    addTeacher,
    deleteTeacher,
    deleteStudent,
    readStudentInfo,
    readTeacherInfo,
    updateStudent,
    updateTeacher
};
