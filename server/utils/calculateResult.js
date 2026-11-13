const calculateResult = (marksObtained, totalMarks, passingMarks) => {
  const percentage = Number(
    ((marksObtained / totalMarks) * 100).toFixed(2)
  );

  let grade;

  if (percentage >= 90) {
    grade = "A+";
  } else if (percentage >= 80) {
    grade = "A";
  } else if (percentage >= 70) {
    grade = "B";
  } else if (percentage >= 60) {
    grade = "C";
  } else if (percentage >= 50) {
    grade = "D";
  } else if (percentage >= 40) {
    grade = "E";
  } else {
    grade = "F";
  }

  const status = marksObtained >= passingMarks
    ? "Pass"
    : "Fail";

  return {
    percentage,
    grade,
    status
  };
};

export default calculateResult;