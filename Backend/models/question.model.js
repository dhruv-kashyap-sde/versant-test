const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    partA: {
        description: { type: String, default: "Candidates are asked to repeat sentences that they hear" },
        questions: [
            { 
                question: { type: String, required: true } 
            }
        ],
    },
    partB: {
        description: { type: String, default: "Candidates hear three short phrases and are asked to rearrange them to make a sentence" },
        questions: [
            { 
                question: { type: String, required: true },
                rearranged: { type: String, required: true }
            }
        ],
    },
    partC: {
        description: { type: String, default: "Candidates listen to a conversation between two speakers and answer a comprehension question with a word or short phrase" },
        questions: [
            { 
                question: { type: String, required: true } 
            }
        ],
    },
    partD: {
        description: { type: String, default: "Candidates read a sentence with a missing word and supply an appropriate word to complete the sentence" },
        questions: [
            { 
                question: { type: String, required: true },
                answer: { type: String, required: true }
            }
        ],
    },
    partE: {
        description: { type: String, default: "Candidates hear a sentence and must type the sentence exactly as they hear it" },
        questions: [
            { 
                question: { type: String, required: true } 
            }
        ],
    },
    partF: {
        description: { type: String, default: "Candidates reconstruct the content of a short passage presented for 30 seconds" },
        questions: [
            { 
                question: { type: String, required: true } 
            }
        ],
    },
}, { timestamps: true });

module.exports = mongoose.model('Question', QuestionSchema);