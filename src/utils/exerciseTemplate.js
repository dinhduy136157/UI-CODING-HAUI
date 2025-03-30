const exerciseTemplates = {
    addNumbers: {
      python: `class Solution:
      def add_numbers(self, a: int, b: int) -> int:
          # Viết code ở đây
          return 0
  `,
      javascript: `class Solution {
      addNumbers(a, b) {
          // Viết code ở đây
          return 0;
      }
  }
  `,
      java: `public class Solution {
      public int addNumbers(int a, int b) {
          // Viết code ở đây
          return 0;
      }
  }
  `,
      cpp: `class Solution {
  public:
      int addNumbers(int a, int b) {
          // Viết code ở đây
          return 0;
      }
  };
  `,
      csharp: `public class Solution {
      public int AddNumbers(int a, int b) {
          // Viết code ở đây
          return 0;
      }
  }
  `
    },
    // Thêm các template bài tập khác ở đây
    findMax: {
      python: `class Solution:
      def find_max(self, nums: list) -> int:
          # Viết code ở đây
          return 0
  `,
      javascript: `class Solution {
      findMax(nums) {
          // Viết code ở đây
          return 0;
      }
  }
  `
      // ... thêm các ngôn ngữ khác
    }
  };
  
  export const getTemplate = (exerciseId, language) => {
    const template = exerciseTemplates[exerciseId]?.[language];
    return template || `// Không tìm thấy template cho bài tập này với ngôn ngữ ${language}`;
  };
  
  export default exerciseTemplates;