export const wrapUserCode = (userCode, testCaseInput, language, exerciseId) => {
  switch (exerciseId) {
    case 'addNumbers':
      return wrapAddNumbers(userCode, testCaseInput, language);
    // Thêm các case cho bài tập khác
    default:
      return userCode;
  }
};

const wrapAddNumbers = (userCode, testCaseInput, language) => {
  switch (language) {
    case "python":
      return `${userCode}\n\nsolution = Solution()\na, b = map(int, "${testCaseInput}".split())\nprint(solution.add_numbers(a, b))`;
    case "javascript":
      return `${userCode}\n\nconst solution = new Solution();\nconst [a, b] = "${testCaseInput}".split(" ").map(Number);\nconsole.log(solution.addNumbers(a, b));`;
    case "java":
      return `${userCode}\n\npublic class Main {\n    public static void main(String[] args) {\n        Solution solution = new Solution();\n        String input = "${testCaseInput}";\n        String[] parts = input.split(" ");\n        int a = Integer.parseInt(parts[0]);\n        int b = Integer.parseInt(parts[1]);\n        System.out.println(solution.addNumbers(a, b));\n    }\n}`;
    case "cpp":
      return `#include <iostream>\n#include <sstream>\nusing namespace std;\n\n${userCode}\n\nint main() {\n    Solution solution;\n    string input = "${testCaseInput}";\n    istringstream iss(input);\n    int a, b;\n    iss >> a >> b;\n    cout << solution.addNumbers(a, b) << endl;\n    return 0;\n}`;
    case "csharp":
      return `${userCode}\n\npublic class Program {\n    public static void Main(string[] args) {\n        Solution solution = new Solution();\n        string[] inputs = "${testCaseInput}".Split(' ');\n        int a = int.Parse(inputs[0]);\n        int b = int.Parse(inputs[1]);\n        Console.WriteLine(solution.AddNumbers(a, b));\n    }\n}`;
    default:
      return userCode;
  }
};

// Thêm các hàm wrapper cho bài tập khác ở đây