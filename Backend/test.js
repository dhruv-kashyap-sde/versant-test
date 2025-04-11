// const evaluatePassage = (originalPassage, userRewrite) => {
//     // If either input is missing, return error
//     if (!originalPassage || !userRewrite) {
//       return {
//         score: 0,
//         pass: false
//       };
//     }


//     // Convert to lowercase and remove punctuation for better comparison
//     const cleanOriginal = originalPassage.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
//     const cleanRewrite = userRewrite.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

//     // Split passages into words
//     const originalWords = cleanOriginal.split(/\s+/).filter(word => word.length > 3);
//     const rewriteWords = cleanRewrite.split(/\s+/).filter(word => word.length > 3);

//     // Check word count - should be somewhat similar to original (not too short)
//     const wordCountRatio = rewriteWords.length / originalWords.length;
//     if (wordCountRatio < 0.5) {
//       return {
//         score: Math.floor(40 * wordCountRatio),
//         pass: false
//       };
//     }

//     // Count significant words from original that appear in the rewrite
//     let keyWordsFound = 0;
//     const uniqueOriginalWords = [...new Set(originalWords)];

//     for (const word of uniqueOriginalWords) {
//       if (rewriteWords.includes(word)) {
//         keyWordsFound++;
//       }
//     }

//     const keyWordRatio = keyWordsFound / uniqueOriginalWords.length;

//     // Calculate overall score
//     let score = 0;
//     let pass = false;

//     if (keyWordRatio < 0.1) {
//       score = 40;
//     } else if (keyWordRatio > 0.7) {
//       score = 60;
//     } else {
//       // Ideal range - using own words while capturing key concepts
//       score = Math.floor(70 + (30 * (keyWordRatio / 0.5)));
//       pass = score > 70;
//     }

//     return {
//       score: Math.min(score, 100),
//       pass,
//       metrics: {
//         wordCountRatio,
//         keyWordRatio
//       }
//     };
//   };
//   let qs= "Mary won this year’s best teacher award at her university. She has been known for her creative and unique teaching style for many years. Her award included a trip to Paris for one week. Mary and her husband have never been to Paris and they are very excited about it."
//   let a = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, odit quos sint ipsam vel blanditiis aliquid totam asperiores, odio esse perferendis ut provident sapiente voluptate, assumenda id quisquam adipisci? Perspiciatis maiores illum numquam cum provident, possimus temporibus tempore ipsa quas blanditiis animi, natus ipsum quia expedita aspernatur. Ex, officia accusamus."

//   console.log(evaluatePassage(qs, a));
//   {
//     "partA": {
//         "answers": [
//             "Somebody told me to speed up.",
//             "Road throughs can be scary when there is no light.",
//             "I can I can believe how quickly the light blips.",
//             "Lost time found in the ground for.",
//             "Which car is yours?",
//             "When you go for an interview, we sure that you in comfortable dress.",
//             "Please look over the turns agreed by Friday.",
//             "Why didn't you deserve large picnic area?",
//             "I can offer you an upgrade.",
//             "Almost all like the snack sons."
//         ]
//     },
//     "partB": {
//         "answers": [
//             "His brother cleaned up the mess.",
//             "The house next door is for sale.",
//             "They they were.",
//             "After the meaning ended, did the salesman laughed immediately?",
//             " ",
//             "He's my friend.",
//             "Do you have do you have any pictures of your family?",
//             "We're going to see some old friends."
//         ]
//     },
//     "partC": {
//         "answers": [
//             "Get up early and go office at 7:30 AM.",
//             "Interesting."
//         ]
//     },
//     "partD": {
//         "answers": [
//             "k",
//             "hot",
//             "small",
//             "going",
//             "come",
//             "purchse",
//             "",
//             "name",
//             "perfomance",
//             ""
//         ]
//     },
//     "partE": {
//         "answers": [
//             "please note that  the fex number will remain same ",
//             "why do you see some of the plant dindt grow",
//             "todays meeting take places earlyer                                            ",
//             "the documnet needs to be edite",
//             "when is the game",
//             "she knows servel gerna",
//             "report any computer needs to be ",
//             "you can  use the computer in a minute",
//             "the proposal is finished",
//             "i turn down the offer ",
//             "i have to agree with you",
//             "we need to make sure that our copo",
//             "i knew something that",
//             "the train comes here every 20 minutes "
//         ]
//     },
//     "partF": {
//         "answers": [
//             "this is new reveval to our company that our company was commited to patient care and good work this is our ",
//             "as i told you to the last meeting, i am moving to  another company next week .at january 25 friday "
//         ]
//     }
// }

// function generateTin() {
//   let tin = '';
//   for (let i = 0; i < 10; i++) {
//       tin += Math.floor(Math.random() * 10);
//   }
//   return tin;
// }
// console.log(generateTin().length);
// console.log(generateTin());
// import stringSimilarity from 'string-similarity';
// import { checkPartD } from "./utils/checkPartD";
// const checkPartD = require("./utils/checkPartD").checkPartD;
// const answers = [
//   "day",
//   "cold",
//   "big",
//   "come",
//   "going",
//   "buy",
//   "cubes",
//   "sur",
//   "lazy",
//   "brought",
// ];

// const q = [
//   {answer:"knight"},
//   {answer:"hot"},
//   {answer:"small"},
//   {answer:"going"},
//   {answer:"come"},
//   {answer:"purchase"},
//   {answer:"balls"},
//   {answer:"name"},
//   {answer:"performance"},
//   {answer:"transferred"}
// ]
// console.log(checkPartD(q, answers));
// const stringSimilarity = require("string-similarity");

// const similarity = stringSimilarity.compareTwoStrings(q[9].answer, answers[9]);
// console.log(similarity);
