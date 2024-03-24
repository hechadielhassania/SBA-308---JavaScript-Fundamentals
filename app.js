// Declare variables properly using let and const where appropriate.
const latePenaltyRate = 0.1; // Penalty rate for late submissions
let result = []; // Variable to store the final result

function getLearnerData(course, ag, submissions) {
  // Use try/catch statements to manage potential errors
  try {
    if (ag.course_id !== course.id) {
      throw new Error("Invalid input: AssignmentGroup does not belong to the provided course.");
    }

    // Iterate through each learner submission
    for (let submission of submissions) {
      const learnerID = submission.learner_id;
      let learnerData = {
        id: learnerID,
        avg: 0,
      };
      let totalScore = 0;
      let totalMaxPoints = 0;

      // Iterate through each assignment in the AssignmentGroup
      for (let assignment of ag.assignments) {
        const matchingSubmission = submissions.find(sub => sub.learner_id === learnerID && sub.assignment_id === assignment.id);
        if (matchingSubmission) {
          const { score, submitted_at } = matchingSubmission.submission;
          const dueDate = new Date(assignment.due_at);

          // Use if/else statement to check if the assignment is past due
          if (new Date(submitted_at) <= dueDate) {
            totalScore += Math.min(score, assignment.points_possible); // Cap score to points_possible
            totalMaxPoints += assignment.points_possible;
            learnerData[assignment.id] = score / assignment.points_possible;
          }
        }
      }

      // Calculate the weighted average for the learner
      learnerData.avg = totalMaxPoints !== 0 ? totalScore / totalMaxPoints : 0;
      result.push(learnerData);
    }

    return result;
  } catch (error) {
    console.error(error.message);
  }
}

// Test data
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

// Call the function
result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

// Output processed data as described above
console.log(result);
