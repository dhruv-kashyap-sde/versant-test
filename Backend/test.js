
const evaluatePassage = (originalPassage, userRewrite) => {
    // If either input is missing, return error
    if (!originalPassage || !userRewrite) {
      return {
        score: 0,
        pass: false
      };
    }
  
    // Convert to lowercase and remove punctuation for better comparison
    const cleanOriginal = originalPassage.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
    const cleanRewrite = userRewrite.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");
  
    // Split passages into words
    const originalWords = cleanOriginal.split(/\s+/).filter(word => word.length > 3);
    const rewriteWords = cleanRewrite.split(/\s+/).filter(word => word.length > 3);
  
    // Check word count - should be somewhat similar to original (not too short)
    const wordCountRatio = rewriteWords.length / originalWords.length;
    if (wordCountRatio < 0.5) {
      return {
        score: Math.floor(40 * wordCountRatio),
        pass: false
      };
    }
  
    // Count significant words from original that appear in the rewrite
    let keyWordsFound = 0;
    const uniqueOriginalWords = [...new Set(originalWords)];
    
    for (const word of uniqueOriginalWords) {
      if (rewriteWords.includes(word)) {
        keyWordsFound++;
      }
    }
  
    const keyWordRatio = keyWordsFound / uniqueOriginalWords.length;
  
    // Calculate overall score
    let score = 0;
    let pass = false;
  
    if (keyWordRatio < 0.1) {
      score = 40;
    } else if (keyWordRatio > 0.7) {
      score = 60;
    } else {
      // Ideal range - using own words while capturing key concepts
      score = Math.floor(70 + (30 * (keyWordRatio / 0.5)));
      pass = score > 70;
    }
  
    return {
      score: Math.min(score, 100),
      pass,
      metrics: {
        wordCountRatio,
        keyWordRatio
      }
    };
  };
  let qs= "Mary won this year’s best teacher award at her university. She has been known for her creative and unique teaching style for many years. Her award included a trip to Paris for one week. Mary and her husband have never been to Paris and they are very excited about it."
  let a = "Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto, odit quos sint ipsam vel blanditiis aliquid totam asperiores, odio esse perferendis ut provident sapiente voluptate, assumenda id quisquam adipisci? Perspiciatis maiores illum numquam cum provident, possimus temporibus tempore ipsa quas blanditiis animi, natus ipsum quia expedita aspernatur. Ex, officia accusamus."
  
  console.log(evaluatePassage(qs, a));
  