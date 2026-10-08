import { RESOURCE_LIBRARY_SEED } from '../data/seedData.js';

export interface DetailedLearningObjectives {
  summary: string;
  coreConcepts: string[];
  subtopics: Array<{ title: string; description: string }>;
  focusAreas: string[];
  learningOutcomes: string[];
}

export interface TopicContent {
  topicKey: string;
  title: string;
  category: 'programming' | 'database' | 'machine_learning' | 'system_design' | 'devops' | 'frontend';
  estimatedMinutes: number;
  conceptsCovered: string[];
  learningObjectives: DetailedLearningObjectives;
  conceptsMarkdown: string;
  examples: Array<{
    title: string;
    codeSnippet: string;
    explanation: string;
  }>;
  commonMistakes: string[];
  checkQuestions: Array<{
    question: string;
    answer: string;
  }>;
  approvedResources: any[];
}

export class TopicContentEngine {
  public getTopicContent(topicKey: string, targetRole: string = 'Software Engineer'): TopicContent {
    const key = (topicKey || '').toLowerCase();

    // 1. Python Functions
    if (key.includes('python_func') || (key.includes('python') && key.includes('func')) || key === 'python_functions') {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('Python'));
      return {
        topicKey: 'python_functions',
        title: 'Python Functions, Scope, Arguments & Lambdas',
        category: 'programming',
        estimatedMinutes: 40,
        conceptsCovered: [
          'Function Definition & Call Syntax',
          'Positional vs Keyword Arguments',
          'Default Arguments & The Mutable Default Trap',
          'Return Statement vs Print & Returning Tuples',
          'Variable Scope (LEGB Rule)',
          'Global & Nonlocal Keywords',
          'Lambda Anonymous Functions',
          '*args and **kwargs Variable Arguments',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn how to write clean, reusable, and modular Python functions. Functions allow you to break large programs into smaller, testable building blocks. You will study how data is passed into functions as arguments, how results are returned, how Python manages variable memory across different scopes, and how to write compact anonymous functions.',
          coreConcepts: [
            'How to define and call reusable functions using the def keyword with clear parameters',
            'The difference between positional arguments (by order) and keyword arguments (by name)',
            'Why return is used to send data back to your program, while print() only outputs text to the screen',
            'How Python resolves variable names using the LEGB scope rule (Local, Enclosing, Global, Built-in)',
            'How to accept dynamic or unknown numbers of inputs using *args (tuples) and **kwargs (dictionaries)',
            'How to write quick, inline single-expression functions using the lambda keyword',
          ],
          subtopics: [
            {
              title: 'Function Syntax & Structure',
              description:
                'Understanding the def keyword, choosing descriptive function names, defining parameter lists, adding docstrings for documentation, and using the return statement.',
            },
            {
              title: 'Positional vs. Keyword Arguments & Defaults',
              description:
                'How Python matches arguments based on their position versus explicit parameter names, and how to define default fallback values for optional inputs.',
            },
            {
              title: 'The Mutable Default Argument Trap',
              description:
                'Why using mutable objects (like lists or dictionaries) as default arguments causes silent bugs where data is shared across multiple calls, and how to safely default to None instead.',
            },
            {
              title: 'Return Values vs. Printing Output',
              description:
                'Understanding that print() only displays information to the console, whereas return passes the data back so it can be saved in variables and used in further calculations.',
            },
            {
              title: 'Variable Scope & The LEGB Rule',
              description:
                'Where variables are born and where they can be accessed: Local (inside the function), Enclosing (nested functions), Global (module level), and Built-in Python names.',
            },
            {
              title: 'Variable-Length Arguments (*args & **kwargs)',
              description:
                'How to write flexible functions that can accept any number of positional arguments as a tuple (*args) or named keyword arguments as a dictionary (**kwargs).',
            },
            {
              title: 'Lambda Functions (Anonymous Functions)',
              description:
                'How to write short, throwaway, single-line functions without giving them a formal name, commonly used inside map(), filter(), and sorted().',
            },
          ],
          focusAreas: [
            'Pay special attention to the difference between return and print — a function without an explicit return statement always returns None implicitly.',
            'Never use mutable default arguments like def add_item(x, items=[]). Always use items=None and initialize items = [] inside the function body.',
            'Master variable scope to prevent accidental global variable dependencies and UnboundLocalError exceptions.',
          ],
          learningOutcomes: [
            'Write clean, modular, and maintainable functions with proper type hints and structured docstrings.',
            'Safely design functions with default parameters without introducing shared state bugs.',
            'Handle arbitrary inputs dynamically using *args and **kwargs in data preprocessing pipelines.',
            'Use lambda functions effectively when sorting, filtering, or mapping complex data collections.',
          ],
        },
        conceptsMarkdown: `### Python Functions: Architecture, Scope & Best Practices

Functions are the core building blocks of reliable data pipelines and production software. In Python, functions are **first-class citizens**, meaning they can be passed as arguments, assigned to variables, and returned from other functions.

#### 1. Parameters vs Arguments & Default Values
Parameters are defined in the function signature; arguments are the values supplied when calling it.

\`\`\`python
def calculate_risk_score(transaction_amount: float, velocity: int, threshold: float = 0.85) -> float:
    """Calculates risk score based on transaction velocity and threshold."""
    base_score = (transaction_amount * 0.05) + (velocity * 0.15)
    return min(1.0, base_score / threshold)
\`\`\`

#### 2. The Mutable Default Argument Pitfall
A classic Python gotcha is using mutable objects (like lists or dicts) as default arguments. Default arguments are evaluated **once at definition time**, not every time the function is called!

\`\`\`python
# ❌ INCORRECT (Shared mutable state across all calls!):
def append_log(event: str, log_list: list = []):
    log_list.append(event)
    return log_list

# ✅ CORRECT (Default to None and initialize inside):
def append_log(event: str, log_list: list = None):
    if log_list is None:
        log_list = []
    log_list.append(event)
    return log_list
\`\`\`

#### 3. Scope & The LEGB Rule
Python resolves variable names using the **LEGB Rule**:
- **L**ocal: Defined inside the current function
- **E**nclosing: In enclosing/nested function scopes
- **G**lobal: Module-level variables
- **B**uilt-in: Python's pre-defined names (\`len\`, \`range\`, etc.)

#### 4. Variable Arguments (\`*args\` and \`**kwargs\`)
- \`*args\` collects extra positional arguments into a **tuple**.
- \`**kwargs\` collects extra keyword arguments into a **dictionary**.

#### 5. Lambda Functions
Lambdas are anonymous, single-expression functions:
\`\`\`python
clean_labels = list(map(lambda x: 1 if x > 0.5 else 0, raw_probabilities))
\`\`\`
`,
        examples: [
          {
            title: 'Configurable Scoring Wrapper with *args and **kwargs',
            codeSnippet: `def run_model_pipeline(model_func, *features, verbose=False, **hyperparams):
    if verbose:
        print(f"Running pipeline with {len(features)} feature tensors and params: {hyperparams}")
    return model_func(*features, **hyperparams)`,
            explanation: 'Uses *features to forward arbitrary inputs and **hyperparams to configure model settings dynamically.',
          },
          {
            title: 'Closure with Lexical Scope for Anomaly Thresholding',
            codeSnippet: `def make_threshold_filter(threshold):
    # Enclosing scope variable 'threshold' is retained by the closure
    return lambda score: score >= threshold

is_critical_fraud = make_threshold_filter(0.95)
print(is_critical_fraud(0.98))  # True`,
            explanation: 'The returned lambda maintains access to the enclosing scope variable threshold even after make_threshold_filter finishes execution.',
          },
        ],
        commonMistakes: [
          'Using a mutable default argument like def f(items=[]) which retains state between function calls.',
          'Forgetting that a function without an explicit return statement returns None implicitly.',
          'Modifying global variables inside a function without declaring global, leading to UnboundLocalError.',
          'Overusing lambda functions for complex logic where a named, documented function is far more maintainable.',
        ],
        checkQuestions: [
          {
            question: 'What is returned by a Python function that executes without reaching a return statement?',
            answer: 'It returns None implicitly.',
          },
          {
            question: 'Why does Python evaluate default parameter values only once at function definition time?',
            answer: 'Python compiles function definitions into code objects at module load time; parameter defaults are stored as a tuple on the function object (__defaults__).',
          },
        ],
        approvedResources,
      };
    }

    // 2. SQL JOINs
    if (key.includes('sql_join') || (key.includes('sql') && key.includes('join')) || key === 'sql_joins') {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('SQL'));
      return {
        topicKey: 'sql_joins',
        title: 'SQL Joins: Relational Data Merging & Optimization',
        category: 'database',
        estimatedMinutes: 45,
        conceptsCovered: [
          'INNER JOIN (Intersection of Matching Keys)',
          'LEFT (OUTER) JOIN (Preserving All Primary Rows)',
          'RIGHT (OUTER) JOIN & Semantic Symmetry',
          'FULL OUTER JOIN (Complete Multi-Table Union)',
          'Join Conditions in ON vs Filtering in WHERE',
          'Accidental Cartesian Products (CROSS JOIN)',
          'Self-Joins for Sequential & Hierarchical Records',
          'Handling NULL Values with COALESCE',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn how to combine data from multiple relational tables using SQL JOINs. In real-world databases, data is split across normalized tables (like customers, accounts, and payments) to prevent duplicate records. You will study how to merge these tables accurately without dropping important records or creating unwanted duplicate rows.',
          coreConcepts: [
            'How relational tables link together using Primary Keys and Foreign Keys',
            'The four primary join types: INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN',
            'The critical difference between matching conditions in the ON clause versus filtering in the WHERE clause',
            'How to join a table to itself (Self-Join) to compare sequential events or hierarchical relationships',
            'How to handle NULL values created in non-matching outer joins using COALESCE()',
            'How to avoid accidental Cartesian Products (massive row multiplications) when join keys are missing',
          ],
          subtopics: [
            {
              title: 'Primary Keys, Foreign Keys & Join Foundations',
              description:
                'Understanding how unique primary keys in one table correspond to foreign keys in another table to establish relational connections.',
            },
            {
              title: 'INNER JOIN (Matching Rows in Both Tables)',
              description:
                'Extracting only those records that have matching keys present in both tables simultaneously.',
            },
            {
              title: 'LEFT (OUTER) JOIN (Preserving Main Table Records)',
              description:
                'Keeping all records from your primary left table, even if there is no corresponding data in the right table (filling empty fields with NULL).',
            },
            {
              title: 'RIGHT JOIN and FULL OUTER JOIN',
              description:
                'Understanding the directional symmetry of RIGHT JOIN and how FULL OUTER JOIN retains all records from both tables.',
            },
            {
              title: 'Filtering in ON vs. Filtering in WHERE',
              description:
                'Understanding why placing right-table conditions in WHERE accidentally turns a LEFT JOIN into an INNER JOIN by rejecting NULL rows.',
            },
            {
              title: 'Self-Joins for Sequential Records',
              description:
                'How to join a single table with itself using distinct table aliases to calculate time differences between consecutive user purchases.',
            },
            {
              title: 'Handling Missing Values with COALESCE()',
              description:
                'How to convert SQL NULL values from unmatched outer joins into clean default values like 0 or "N/A" so calculations remain accurate.',
            },
          ],
          focusAreas: [
            'Always verify whether you need an INNER JOIN or a LEFT JOIN: if you need all customers even if they have 0 purchases, you MUST use a LEFT JOIN.',
            'Never place filters on the right table in the WHERE clause when using a LEFT JOIN; always put them in the ON clause to keep non-matching left records.',
            'Always join on indexed unique keys to prevent accidental Cartesian products and query timeouts.',
          ],
          learningOutcomes: [
            'Write clean multi-table queries that accurately extract and merge relational data.',
            'Identify customers or entities with zero transactions by checking WHERE right_table.id IS NULL.',
            'Use COALESCE() to guarantee aggregate totals (like SUM or COUNT) return valid numbers rather than NULLs.',
            'Confidently answer technical interview questions regarding join mechanics and execution plans.',
          ],
        },
        conceptsMarkdown: `### SQL JOINs: Theory, Venn Semantics & Query Execution

In production analytics and feature stores, business entities (users, transactions, merchants, accounts) are normalized across separate relational tables. Mastering SQL joins is essential to merge datasets accurately without dropping rows or causing row explosions.

#### 1. The Core Join Spectrum
- **INNER JOIN**: Returns rows only when the join condition matches in **both** tables.
- **LEFT JOIN**: Returns **all** rows from the left table, plus matched records from the right table. If no match exists, columns from the right table contain \`NULL\`.
- **RIGHT JOIN**: Returns all rows from the right table, plus matched records from the left table.
- **FULL OUTER JOIN**: Returns all rows from both tables, filling \`NULL\` whenever a match is absent on either side.

\`\`\`sql
-- Finding users who have NEVER made a transaction:
SELECT 
  u.id AS user_id,
  u.email,
  t.id AS transaction_id
FROM users u
LEFT JOIN transactions t ON u.id = t.user_id
WHERE t.id IS NULL; -- Filters strictly to non-matching records
\`\`\`

#### 2. ON Clause vs WHERE Clause in Outer Joins
- In an **INNER JOIN**, filtering in \`ON\` vs \`WHERE\` yields identical results.
- In a **LEFT JOIN**, filtering the right table in \`WHERE\` **converts the query into an INNER JOIN** because it rejects the \`NULL\` rows!
- To preserve all left rows while applying conditions to the right table, always place the condition in the \`ON\` clause!
`,
        examples: [
          {
            title: 'Detecting Rapid Card Re-use via Self-Join',
            codeSnippet: `SELECT 
  t1.card_id,
  t1.id AS first_tx_id,
  t2.id AS second_tx_id,
  t1.created_at AS t1_time,
  t2.created_at AS t2_time
FROM transactions t1
JOIN transactions t2 
  ON t1.card_id = t2.card_id 
  AND t1.id != t2.id
  AND t2.created_at > t1.created_at
  AND t2.created_at <= t1.created_at + INTERVAL 2 MINUTE;`,
            explanation: 'Joins transactions with itself to identify pairs of purchases on the same card within 2 minutes of each other.',
          },
          {
            title: 'Safe Aggregation Over Left Joined Tables with COALESCE',
            codeSnippet: `SELECT 
  m.merchant_id,
  m.merchant_name,
  COUNT(t.id) AS total_sales_count,
  COALESCE(SUM(t.amount), 0) AS total_revenue
FROM merchants m
LEFT JOIN transactions t ON m.merchant_id = t.merchant_id
GROUP BY m.merchant_id, m.merchant_name;`,
            explanation: 'COALESCE ensures merchants with 0 sales report revenue of 0 instead of SQL NULL.',
          },
        ],
        commonMistakes: [
          'Filtering a LEFT JOIN in the WHERE clause on right-table columns, accidentally turning it into an INNER JOIN.',
          'Missing a join key condition on non-unique foreign keys, causing a massive Cartesian product row explosion.',
          'Counting joined rows with COUNT(*) instead of COUNT(right_table.id), falsely reporting 1 row for empty outer joins.',
          'Joining on columns with differing data types (e.g. integer id vs varchar id), preventing index usage.',
        ],
        checkQuestions: [
          {
            question: 'Why does COUNT(*) on a LEFT JOIN return 1 even if the right table had no matching rows?',
            answer: 'COUNT(*) counts every result row generated. Since the left table row was preserved, one row exists. Use COUNT(right_table.id) instead.',
          },
          {
            question: 'When should a join condition be in the ON clause versus the WHERE clause in a LEFT JOIN?',
            answer: 'Conditions defining how rows are matched belong in ON; conditions filtering the final preserved result set belong in WHERE.',
          },
        ],
        approvedResources,
      };
    }

    // 3. SQL Window Functions & Advanced Analytics
    if (key.includes('sql_advanced') || key.includes('window_func') || key.includes('analytics')) {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('SQL'));
      return {
        topicKey: 'sql_advanced_analytics',
        title: 'SQL Window Functions & Advanced Analytical Aggregations',
        category: 'database',
        estimatedMinutes: 50,
        conceptsCovered: [
          'The OVER() Clause (PARTITION BY & ORDER BY)',
          'Ranking Functions: ROW_NUMBER(), RANK(), DENSE_RANK()',
          'Positional Value Access: LAG() and LEAD()',
          'Sliding Window Framing: ROWS BETWEEN',
          'Cumulative Sums & Moving Averages',
          'CTE Filtering on Window Calculations',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn how to perform calculations across related rows using SQL Window Functions without collapsing them into a single row. Unlike a regular GROUP BY which compresses multiple rows into one summary row, window functions allow you to calculate running totals, moving averages, top rankings, and compare current rows to previous or next rows while keeping every original row visible.',
          coreConcepts: [
            'The syntax and power of the OVER() clause with PARTITION BY and ORDER BY',
            'Ranking functions: ROW_NUMBER(), RANK(), and DENSE_RANK(), and when to choose each one',
            'Value functions: LAG() (looking back at previous rows) and LEAD() (looking forward to future rows)',
            'Calculating running totals and moving averages with sliding window frames (ROWS BETWEEN)',
            'Using Common Table Expressions (CTEs) to filter rows based on window calculations (like Top 3 sales)',
          ],
          subtopics: [
            {
              title: 'Window Functions vs. Standard GROUP BY',
              description:
                'Understanding why window functions retain individual row identities while calculating group-level metrics simultaneously.',
            },
            {
              title: 'Partitioning & Ordering (OVER clause)',
              description:
                'Splitting data into subsets using PARTITION BY and controlling the calculation sequence using ORDER BY.',
            },
            {
              title: 'Ranking Functions (ROW_NUMBER, RANK, DENSE_RANK)',
              description:
                'How to assign positions to items, handle ties fairly, and select the top N items in each category.',
            },
            {
              title: 'Time Travel Analysis with LAG and LEAD',
              description:
                'Accessing previous or following row values to calculate day-over-day growth rates, customer retention, and session gaps.',
            },
            {
              title: 'Running Totals & Moving Averages (Window Frames)',
              description:
                'Defining custom frame boundaries (like preceding 7 rows) to smooth out noisy metrics and compute cumulative revenue.',
            },
          ],
          focusAreas: [
            'Remember the SQL order of execution: window functions run AFTER WHERE and GROUP BY, which means you cannot filter directly with WHERE ROW_NUMBER() = 1 without wrapping it in a CTE or subquery.',
            'Know the difference between RANK() (which skips rank numbers on ties, e.g. 1, 2, 2, 4) and DENSE_RANK() (which never skips numbers, e.g. 1, 2, 2, 3).',
            'Always specify an explicit ORDER BY inside OVER() when doing cumulative calculations to ensure predictable math.',
          ],
          learningOutcomes: [
            'Write high-performance analytics queries that compute top-performer rankings without slow self-joins.',
            'Calculate month-over-month growth rates and day-to-day metric differences effortlessly using LAG().',
            'Build 7-day and 30-day moving average dashboards for tracking trend metrics.',
            'Solve real-world SQL window function interview challenges asked by top tech firms.',
          ],
        },
        conceptsMarkdown: `### SQL Window Functions: Real-Time Analytics & Trend Calculations

Window functions execute calculations across a set of table rows that are somehow related to the current row.

#### 1. The Anatomy of an OVER() Clause
\`\`\`sql
SELECT 
  employee_id,
  department,
  salary,
  AVG(salary) OVER (PARTITION BY department) as dept_avg_salary,
  salary - AVG(salary) OVER (PARTITION BY department) as diff_from_dept_avg
FROM employees;
\`\`\`

#### 2. Ranking: ROW_NUMBER vs RANK vs DENSE_RANK
- \`ROW_NUMBER()\`: Strictly assigns sequential numbers (1, 2, 3, 4) regardless of ties.
- \`RANK()\`: Tied items receive the same rank; the next item skips ranks (1, 2, 2, 4).
- \`DENSE_RANK()\`: Tied items receive the same rank; the next item does not skip ranks (1, 2, 2, 3).

#### 3. Period-Over-Period Calculations with LAG
\`\`\`sql
SELECT 
  date,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY date) as previous_day_revenue,
  ROUND(((revenue - LAG(revenue, 1) OVER (ORDER BY date)) / LAG(revenue, 1) OVER (ORDER BY date)) * 100, 2) as daily_growth_pct
FROM daily_sales;
\`\`\`
`,
        examples: [
          {
            title: 'Top 3 Highest Earners per Department using CTE & DENSE_RANK',
            codeSnippet: `WITH RankedSalaries AS (
  SELECT 
    department,
    employee_name,
    salary,
    DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank_in_dept
  FROM employees
)
SELECT * FROM RankedSalaries WHERE rank_in_dept <= 3;`,
            explanation: 'Uses a CTE because window functions cannot be filtered in the outer WHERE clause directly.',
          },
        ],
        commonMistakes: [
          'Attempting to filter window functions in the WHERE clause of the same query block.',
          'Omitting ORDER BY in cumulative calculations, causing the window function to aggregate the entire partition instead of rolling cumulative rows.',
          'Using RANK() when you need strictly sequential top ranks without gaps—use DENSE_RANK() or ROW_NUMBER().',
        ],
        checkQuestions: [
          {
            question: 'Why cannot window functions be evaluated directly in the WHERE clause?',
            answer: 'In SQL query processing order, WHERE executes before window functions are calculated. You must use a CTE or subquery to filter on them.',
          },
        ],
        approvedResources,
      };
    }

    // 4. Pandas & Data Wrangling
    if (key.includes('pandas') || key.includes('data_wrangling') || key.includes('dataframe')) {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('Python'));
      return {
        topicKey: 'pandas_data_wrangling',
        title: 'Pandas Data Wrangling, Cleaning & Transformation',
        category: 'programming',
        estimatedMinutes: 45,
        conceptsCovered: [
          'Series & DataFrame Foundations',
          'Indexing & Slicing (.loc vs .iloc)',
          'Handling Missing Values (.isna, .fillna, .dropna)',
          'Groupby Aggregations & Pivot Tables',
          'Merging, Joining & Concatenating DataFrames',
          'Vectorized Operations vs Row Iteration',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn how to clean, manipulate, and analyze tabular data using Python\'s Pandas library. Real-world data is almost always messy, incomplete, and formatted incorrectly. You will study how to inspect dataframes, handle missing values, filter rows, aggregate statistics, and combine datasets to prepare them for analysis or machine learning.',
          coreConcepts: [
            'Understanding Series (1D) and DataFrame (2D) data structures',
            'Selecting and filtering data safely using .loc[] (label-based) and .iloc[] (integer position-based)',
            'Detecting and resolving missing data with .isna(), .fillna(), and .dropna()',
            'Grouping data by categories and calculating summaries using .groupby() and .agg()',
            'Merging and concatenating multiple datasets together using .merge() and pd.concat()',
            'Writing vectorized operations instead of slow for-loops to process millions of rows in seconds',
          ],
          subtopics: [
            {
              title: 'DataFrame Creation & Data Inspection',
              description:
                'Loading CSV/JSON files, checking column data types (df.dtypes), summarizing statistics (df.describe()), and checking memory usage.',
            },
            {
              title: 'Filtering, Slicing & The SettingWithCopy Warning',
              description:
                'Filtering rows using boolean conditions and modifying slices correctly using .loc to avoid silent bugs.',
            },
            {
              title: 'Handling Missing & Null Values',
              description:
                'Finding null values across columns and choosing whether to drop rows or impute missing values with means, medians, or placeholders.',
            },
            {
              title: 'Category Grouping & Custom Aggregations',
              description:
                'Splitting data into groups (like departments or customer types) and computing multiple metrics (mean, sum, count) at once.',
            },
            {
              title: 'Merging, Joining & Reshaping Data',
              description:
                'Combining disparate datasets using relational keys (inner/left joins in pandas) and pivoting long tables into wide formats.',
            },
          ],
          focusAreas: [
            'Always use .loc[row_condition, \'column_name\'] when assigning values to prevent the dreaded SettingWithCopyWarning.',
            'Never iterate over DataFrame rows using a Python for loop or .iterrows() for calculations — always use built-in vectorized methods.',
            'Always verify data types after loading files, especially dates (pd.to_datetime) and numeric fields parsed as strings.',
          ],
          learningOutcomes: [
            'Take messy raw CSV files and transform them into clean, structured data ready for dashboards and machine learning.',
            'Filter, slice, and mutate large tables without memory bloat or performance bottlenecks.',
            'Aggregate complex business metrics across multiple dimensions in just 2-3 lines of code.',
            'Confidently build data cleaning pipelines during coding assessments and technical interviews.',
          ],
        },
        conceptsMarkdown: `### Pandas: High-Performance Data Manipulation & Transformation

Pandas is the standard industry library for tabular data manipulation in Python.

#### 1. Slicing Safely: .loc vs .iloc
\`\`\`python
import pandas as pd

# .loc uses labels/column names
high_value = df.loc[df['transaction_amount'] > 1000, ['user_id', 'status']]

# .iloc uses integer index positions
first_five_rows_first_three_cols = df.iloc[0:5, 0:3]
\`\`\`

#### 2. Groupby Aggregation
\`\`\`python
summary = df.groupby('category').agg(
    total_sales=('amount', 'sum'),
    average_sale=('amount', 'mean'),
    order_count=('order_id', 'count')
).reset_index()
\`\`\`
`,
        examples: [
          {
            title: 'Cleaning Dirty Financial Records in Pandas',
            codeSnippet: `df['date'] = pd.to_datetime(df['date'])
df['amount'] = df['amount'].fillna(df['amount'].median())
df['category'] = df['category'].str.strip().str.title()
df = df.drop_duplicates(subset=['transaction_id'])`,
            explanation: 'Converts date strings, imputes missing amounts with median, normalizes text casing, and deduplicates.',
          },
        ],
        commonMistakes: [
          'Using for loops or .iterrows() to update columns instead of vectorized series operations.',
          'Modifying dataframe slices without .copy() or .loc, causing SettingWithCopyWarning.',
          'Dropping nulls without checking if whole columns or majority rows are being eliminated.',
        ],
        checkQuestions: [
          {
            question: 'Why are vectorized operations in Pandas much faster than Python for-loops?',
            answer: 'Vectorized operations execute in compiled C code at the NumPy level without Python interpreter loop overhead.',
          },
        ],
        approvedResources,
      };
    }

    // 5. Machine Learning & Classification
    if (key.includes('machine_learning') || key.includes('ml_') || key.includes('classification')) {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('Python'));
      return {
        topicKey: 'machine_learning_basics',
        title: 'Machine Learning Classification, Imbalance & Evaluation',
        category: 'machine_learning',
        estimatedMinutes: 50,
        conceptsCovered: [
          'The Accuracy Fallacy in Imbalanced Datasets',
          'Precision, Recall & The Harmonic F1 Score',
          'Precision-Recall AUC vs ROC-AUC',
          'Class Imbalance Solutions: SMOTE, Undersampling & scale_pos_weight',
          'Confusion Matrix Dissection (TP, FP, TN, FN)',
          'Overfitting vs Underfitting (Bias-Variance)',
          'Stratified K-Fold Cross Validation',
          'Threshold Calibration for Business Cost Matrix',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn the core foundations of supervised classification and how to handle severe class imbalance. You will study why raw Accuracy fails when the target event is rare (such as fraud detection, cancer diagnosis, or network intrusion), how to evaluate models using Precision, Recall, and PR-AUC, and how to calibrate decision thresholds for real-world impact.',
          coreConcepts: [
            'How binary classification algorithms create decision boundaries between classes',
            'Why high accuracy is misleading when the positive class represents less than 1% of the dataset',
            'The trade-off between Precision (reducing false alarms) and Recall (catching true positive events)',
            'How to interpret the Confusion Matrix: True Positives, False Positives, True Negatives, and False Negatives',
            'Algorithmic methods for imbalanced data: scale_pos_weight in XGBoost, class_weight in Scikit-Learn, and SMOTE resampling',
            'How to prevent data leakage during train/test splits and cross-validation',
          ],
          subtopics: [
            {
              title: 'The Accuracy Fallacy in Rare Classes',
              description:
                'Understanding why predicting 100% negative gives 99.9% accuracy while detecting zero target instances, and why alternate metrics are essential.',
            },
            {
              title: 'Precision, Recall & Harmonic F1 Score',
              description:
                'Calculating Precision (how many predicted alerts were real) and Recall (how many real events were caught), and using F1/F-beta scores.',
            },
            {
              title: 'PR-AUC vs. ROC-AUC Curves',
              description:
                'Why ROC curves are overly optimistic on imbalanced data, and why Precision-Recall curves give a true reflection of model performance.',
            },
            {
              title: 'Handling Class Imbalance (Cost-Sensitive & SMOTE)',
              description:
                'Using loss function penalties like scale_pos_weight versus generating synthetic samples with SMOTE.',
            },
            {
              title: 'Cross-Validation & Data Leakage Prevention',
              description:
                'Using Stratified K-Fold to maintain class ratios and ensuring all feature scaling and oversampling happen strictly inside the training fold.',
            },
            {
              title: 'Decision Threshold Calibration',
              description:
                'Shifting the probability threshold from 0.5 to a business-optimal value based on the financial cost of false positives vs. false negatives.',
            },
          ],
          focusAreas: [
            'Never evaluate an imbalanced classification model on raw Accuracy alone; always check Precision, Recall, and PR-AUC.',
            'Never apply SMOTE or fit scalers before splitting data into train and test folds, as this causes catastrophic data leakage.',
            'Always calibrate your decision threshold based on business costs rather than leaving it at default 0.5.',
          ],
          learningOutcomes: [
            'Build and evaluate classification models on severely imbalanced real-world datasets.',
            'Interpret and explain confusion matrices and trade-offs to technical and business stakeholders.',
            'Implement Stratified K-Fold cross-validation pipelines without leaking test data.',
            'Tune probability thresholds to optimize business objectives.',
          ],
        },
        conceptsMarkdown: `### Machine Learning Classification: Real-World Evaluation

In mission-critical applications (such as fraud detection, cancer diagnosis, and cyber defense), the target class is extremely rare—often less than 0.1% of all instances.

#### 1. Why Accuracy is a Misleading Metric
If a dataset contains 99,900 legitimate transactions and 100 fraudulent transactions, a naive model that predicts "Legitimate" for every single transaction achieves **99.9% Accuracy**.
Yet, it detected **0% of the fraud** and is completely useless.

#### 2. The Core Metrics
- **Precision**: TP / (TP + FP) — Out of all flagged cases, how many were actually positive?
- **Recall**: TP / (TP + FN) — Out of all real positive cases, how many did we catch?
- **F1 Score**: Harmonic mean of Precision and Recall.
`,
        examples: [
          {
            title: 'Configuring XGBoost with scale_pos_weight for Rare Class',
            codeSnippet: `import xgboost as xgb

ratio = 99900 / 100

model = xgb.XGBClassifier(
    scale_pos_weight=ratio,
    eval_metric='aucpr',
    n_estimators=300,
    max_depth=6,
    learning_rate=0.05
)`,
            explanation: 'scale_pos_weight multiplies the gradient of positive instances, penalizing missed minority cases heavily.',
          },
        ],
        commonMistakes: [
          'Using accuracy to evaluate models trained on highly imbalanced datasets.',
          'Applying SMOTE before train/test split, causing catastrophic data leakage from the test set into training.',
          'Relying solely on ROC-AUC when positive instances represent less than 1% of the population.',
          'Leaving the decision threshold at default 0.5 without calibrating to the business cost matrix.',
        ],
        checkQuestions: [
          {
            question: 'Why must SMOTE resampling be applied ONLY to the training fold during cross-validation?',
            answer: 'Applying SMOTE to the whole dataset creates synthetic points derived from validation samples, causing target leakage and invalid validation scores.',
          },
          {
            question: 'When is Precision more critical than Recall?',
            answer: 'When the business cost of a false positive is extremely high (e.g., blocking high-value VIP cardholders or spamming users with critical alerts).',
          },
        ],
        approvedResources,
      };
    }

    // 6. Applied Probability & Financial Risk Statistics
    if (key.includes('math') || key.includes('prob') || key.includes('stats') || key.includes('bayes')) {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('Statistics') || r.associatedSkills.includes('Python'));
      return {
        topicKey: 'fintech_math_prob_stats',
        title: 'Applied Probability & Financial Risk Statistics',
        category: 'machine_learning',
        estimatedMinutes: 45,
        conceptsCovered: [
          'Bayes Theorem & Prior Odds Formulation',
          'The Base-Rate Fallacy under Rare Class Rarity (<0.1%)',
          'Heavy-Tailed & Pareto Transaction Amount Modeling',
          'Statistical Power & Sample Size for Risk Rule A/B Tests',
          'Log-Odds Transformations & Credit/Risk Scorecards',
          'Confidence Intervals on Low-Frequency Events',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn the mathematical and statistical foundations required for FinTech risk engineering. Under severe class rarity (<0.1% fraud), standard assumptions fail. You will master Bayes\' Theorem to conquer the base-rate fallacy, model fat-tailed financial dollar amounts using Pareto distributions, and conduct hypothesis tests to validate risk rule rollouts without causing revenue loss.',
          coreConcepts: [
            'Bayes\' Theorem and the Base-Rate Fallacy in rare-event detection',
            'Modeling heavy-tailed and Pareto transaction amount distributions',
            'Prior vs Posterior probability updates when combining multiple independent risk signals',
            'Hypothesis testing (A/B testing risk rules) and Statistical Power calculation',
            'Log-odds and logistic transformations for scoring engines',
          ],
          subtopics: [
            {
              title: 'The Base-Rate Fallacy & Bayes Theorem',
              description:
                'Why a 99% accurate model creates overwhelming false alerts when the prior probability of fraud is 0.1%, and how to compute exact posterior odds.',
            },
            {
              title: 'Heavy-Tailed & Extreme Value Distributions',
              description:
                'Understanding why transaction amounts follow log-normal and Pareto power-law distributions rather than standard Gaussian bell curves.',
            },
            {
              title: 'Statistical Testing for Risk Rules',
              description:
                'Conducting two-sample hypothesis tests to measure whether a new decline rule genuinely reduces chargeback rates without harming checkout conversion.',
            },
            {
              title: 'Log-Odds & Calibration Scoring',
              description:
                'Transforming probabilities into credit/risk scorecards using log-odds scaling used across credit bureaus and payment networks.',
            },
          ],
          focusAreas: [
            'Always calculate the posterior probability using the true base rate; never rely on raw model confidence scores alone.',
            'Beware of assuming normal distributions for dollar amounts — 80% of fraud losses often come from the top 1% of transaction amounts.',
            'Ensure sample sizes in risk A/B tests have sufficient statistical power before rolling out aggressive blocking rules.',
          ],
          learningOutcomes: [
            'Compute Bayesian posterior risk probabilities accurately under extreme class imbalance.',
            'Fit power-law distributions to financial transaction losses and determine optimal cutoff points.',
            'Design and evaluate risk rule experiments using rigorous statistical hypothesis tests.',
            'Ace technical screening questions on probability and statistics at top FinTech firms.',
          ],
        },
        conceptsMarkdown: `### Applied Probability & Financial Risk Statistics

FinTech risk engineering operates in an asymmetric domain where the positive target (fraudulent transaction) accounts for less than **0.1% of all traffic**.

#### 1. The Base-Rate Fallacy in Fraud Detection
Consider a fraud classification rule with:
- **Sensitivity (Recall)**: 95% (catches 95% of true fraud)
- **False Positive Rate**: 2% (flags 2% of legitimate transactions)
- **Base Rate (Prior)**: 0.1% (1 in 1,000 transactions is fraudulent)

Using Bayes' Theorem:
\`\`\`
P(Fraud | Flagged) = [P(Flagged | Fraud) * P(Fraud)] / P(Flagged)
P(Fraud | Flagged) = [0.95 * 0.001] / [(0.95 * 0.001) + (0.02 * 0.999)]
P(Fraud | Flagged) = 0.00095 / [0.00095 + 0.01998] ≈ 0.0454 (4.54%)
\`\`\`
**Crucial Industry Insight**: Even with a model that has 95% sensitivity and only 2% false positives, **only 4.5% of flagged transactions are actually fraud!** 95.5% of flagged events are legitimate customers. If you hard-decline every flagged event, you will destroy customer trust and revenue.

#### 2. Heavy-Tailed Dollar Distributions
Financial transaction dollar amounts do not follow a Gaussian normal distribution. They follow a **Pareto (Power Law)** or log-normal distribution:
\`\`\`python
import numpy as np
from scipy import stats

# Fit Pareto distribution to extreme loss tail
shape, loc, scale = stats.pareto.fit(transaction_amounts)
value_at_risk_99 = stats.pareto.ppf(0.99, shape, loc, scale)
\`\`\`
`,
        examples: [
          {
            title: 'Bayesian Posterior Calculator in Python',
            codeSnippet: `def bayesian_fraud_posterior(prior_rate: float, sensitivity: float, fpr: float) -> float:
    """Calculates true probability of fraud given a positive flag."""
    numerator = sensitivity * prior_rate
    denominator = numerator + (fpr * (1.0 - prior_rate))
    return numerator / denominator

# With 0.1% base rate, 95% sensitivity, 1% false positive rate:
p_fraud = bayesian_fraud_posterior(0.001, 0.95, 0.01)
print(f"Empirical probability of fraud: {p_fraud * 100:.2f}%") # ~8.69%`,
            explanation: 'Demonstrates why base rate must be factored into decision thresholds.',
          },
        ],
        commonMistakes: [
          'Assuming a 99% accurate model catches fraud without high false alarms.',
          'Assuming transaction amounts follow a normal Gaussian curve.',
          'Rolling out blocking rules without running statistical power tests.',
        ],
        checkQuestions: [
          {
            question: 'Why does a model with 95% sensitivity and 2% false alarm rate only achieve ~4.5% precision on fraud?',
            answer: 'Because of the base-rate fallacy: legitimate transactions outnumber fraudulent ones 1000 to 1, so the 2% false alarms on the huge negative majority swamp the true positives.',
          },
        ],
        approvedResources,
      };
    }

    // 7. Velocity Feature Engineering
    if (key.includes('velocity') || key.includes('feature_engineering')) {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('Pandas') || r.associatedSkills.includes('Python'));
      return {
        topicKey: 'feature_engineering_fraud',
        title: 'Feature Engineering & Velocity Indicators',
        category: 'machine_learning',
        estimatedMinutes: 50,
        conceptsCovered: [
          'Sliding-Window Velocity Counters (5m, 1h, 24h, 7d)',
          'Haversine Geographical Speed Anomalies (> 500 mph)',
          'Card-to-IP and Device-to-Account Ratio Indicators',
          'Out-of-Fold Target Encoding on High-Cardinality MCC Codes',
          'Zero-Leakage TimeSeries Transformations',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn how to engineer domain-specific velocity counters and behavioral discrepancy signals. In FinTech, raw transaction attributes carry minimal signal on their own. The true predictive power comes from historical context: how many cards this device used in the past 10 minutes, geographical distance between consecutive swipes, and sudden spikes over historical baselines.',
          coreConcepts: [
            'Rolling sliding-window counters (transaction count, sum, max over 5m, 1h, 24h, 7d)',
            'Geographical velocity using the Haversine distance formula to catch physically impossible travel (speed > 500 mph)',
            'Entity linkage and ratio features (distinct cards per IP, distinct emails per device fingerprint)',
            'Categorical encoding for high-cardinality values (Merchant Category Codes - MCC, ZIP codes)',
            'Preventing future data leakage when constructing time-series feature pipelines',
          ],
          subtopics: [
            {
              title: 'Sliding-Window Velocity Counters',
              description: 'Computing rolling aggregates per user, card, and device to detect high-frequency card testing and bot attacks.',
            },
            {
              title: 'Geographical Haversine Velocity',
              description: 'Calculating distance and speed between consecutive swipes to detect cloned cards used across cities or continents simultaneously.',
            },
            {
              title: 'Device & IP Fingerprint Ratios',
              description: 'Tracking many-to-one and one-to-many relationships (e.g. 50 different cards attempted from one IP address within an hour).',
            },
            {
              title: 'Out-of-Fold Target Encoding',
              description: 'Encoding high-cardinality merchant categories without overfitting or leaking target label information into validation sets.',
            },
          ],
          focusAreas: [
            'Never use global aggregations that peek into future rows; all velocity windows must be strictly backward-looking from the transaction timestamp.',
            'Cache rolling counters in memory (Redis) rather than computing expensive multi-table scans on every live transaction.',
            'Handle edge cases for new users with zero transaction history using population fallback priors.',
          ],
          learningOutcomes: [
            'Extract high-signal velocity features that boost model PR-AUC by 40%+ over raw columns.',
            'Implement Haversine geodistance velocity detectors in Python.',
            'Build Scikit-learn feature engineering transformers with zero lookahead leakage.',
            'Articulate how Stripe Radar and PayPal engineer behavioral features to interviewers.',
          ],
        },
        conceptsMarkdown: `### Feature Engineering & Velocity Indicators

In production fraud systems, **over 80% of model lift** comes from domain-engineered features rather than model architecture tweaks.

#### 1. Sliding Window Velocity
Fraudsters often test stolen cards rapidly before the bank can freeze them. A cardholder who normally makes 1 transaction per day suddenly attempting 6 transactions in 10 minutes is a classic velocity spike.

#### 2. Physical Impossible Travel (Haversine Speed)
If a card is used in New York at 12:00 PM and then swiped in London at 1:00 PM:
\`\`\`python
from math import radians, cos, sin, asin, sqrt

def haversine_distance_miles(lat1, lon1, lat2, lon2):
    # Radius of earth in miles
    r = 3956
    dlat, dlon = radians(lat2 - lat1), radians(lon2 - lon1)
    a = sin(dlat/2)**2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    return r * c

# Distance: 3,450 miles in 1 hour -> Speed: 3,450 mph (Impossible -> Definite Fraud)
\`\`\`
`,
        examples: [
          {
            title: 'Rolling 1-Hour Velocity Transformer in Pandas',
            codeSnippet: `import pandas as pd

def add_rolling_velocity(df: pd.DataFrame) -> pd.DataFrame:
    df = df.sort_values('timestamp')
    # Set timestamp as index for time-based rolling
    df_indexed = df.set_index('timestamp')
    
    # 1-hour rolling count and sum grouped by user_id
    rolling_1h = (
        df_indexed.groupby('user_id')['amount']
        .rolling('1h', closed='left') # 'left' prevents lookahead leakage!
        .agg(['count', 'sum'])
        .reset_index()
    )
    return df.merge(rolling_1h, on=['user_id', 'timestamp'], how='left')`,
            explanation: 'Uses closed="left" to strictly avoid data leakage from the current row.',
          },
        ],
        commonMistakes: [
          'Using centered or closed="both" rolling windows that leak future transactions.',
          'Failing to handle first-time transactions with NaN imputation.',
          'Ignoring timezone discrepancies between IP geo-location and user home address.',
        ],
        checkQuestions: [
          {
            question: 'Why must rolling windows specify closed="left" when generating training features?',
            answer: 'Because closed="left" excludes the current transaction from its own historical aggregate, preventing lookahead data leakage.',
          },
        ],
        approvedResources,
      };
    }

    // 8. Unsupervised Anomaly Detection
    if (key.includes('anomaly') || key.includes('novelty') || key.includes('isolation')) {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('Python') || r.associatedSkills.includes('Machine Learning'));
      return {
        topicKey: 'anomaly_detection_fraud',
        title: 'Unsupervised Anomaly Detection & Novelty Detection',
        category: 'machine_learning',
        estimatedMinutes: 45,
        conceptsCovered: [
          'Chargeback Settlement Lag (60-90 Days)',
          'Isolation Forest Tree Mechanics & Path Length',
          'Local Outlier Factor (LOF) Density Estimation',
          'DBSCAN Clustering for Syndicated Fraud Rings',
          'Contamination Hyperparameter Tuning',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn how to detect zero-day fraud attacks and syndicated crime rings without labeled data. Confirmed fraud chargebacks take 60 to 90 days to settle with Visa/Mastercard. During that lag, supervised models are blind. You will master Isolation Forests, Local Outlier Factor, and graph entity clustering to catch novel attack patterns before labels exist.',
          coreConcepts: [
            'Why supervised models fail during the 60-90 day chargeback settlement lag',
            'Isolation Forest mechanics: recursive random partitioning isolating anomalies near the root',
            'Local Outlier Factor (LOF) for density-based local anomaly scoring',
            'Graph-based entity resolution and DBSCAN clustering to uncover organized fraud rings',
            'Tuning contamination rate hyperparameters without ground-truth labels',
          ],
          subtopics: [
            {
              title: 'The Chargeback Lag Problem',
              description: 'Understanding the 2-3 month feedback delay in financial fraud and why unsupervised novelty detection is mandatory.',
            },
            {
              title: 'Isolation Forest Algorithm',
              description: 'How random trees isolate anomalous feature points with significantly shorter path lengths than normal inliers.',
            },
            {
              title: 'Density & Distance-Based Detectors (LOF)',
              description: 'Detecting transactions that fall into low-density sparse regions compared to their nearest neighbors.',
            },
            {
              title: 'Syndicated Ring Clustering with DBSCAN',
              description: 'Grouping transactions sharing subtle fingerprint tokens (identical browser headers, sequential card numbers) into fraud rings.',
            },
          ],
          focusAreas: [
            'Remember that anomaly detection flags statistical rarities — some will be legitimate high-value VIP customers, requiring soft challenges (3D Secure) rather than hard declines.',
            'Contamination parameter must be set conservatively (typically 0.005 to 0.01) to avoid overwhelming manual review queues.',
            'Normalize and scale numeric dimensions before running distance-based algorithms.',
          ],
          learningOutcomes: [
            'Implement and tune Isolation Forests on streaming transaction datasets.',
            'Cluster and detect syndicated fraud rings using DBSCAN and entity graphs.',
            'Defend the dual-layer strategy (supervised + unsupervised) during FinTech architecture interviews.',
          ],
        },
        conceptsMarkdown: `### Unsupervised Anomaly Detection & Novelty Detection

In the payments industry, **confirmed chargeback fraud labels arrive 60 to 90 days after transaction execution**. If a botnet starts testing 100,000 compromised cards today, supervised models cannot learn the new pattern until 3 months later.

#### Isolation Forest Mechanics
Isolation Forests work on the principle that anomalies are "few and different". Instead of profiling normal data, they recursively isolate points using random axis-aligned splits.
- **Normal points**: Require many splits to isolate (deep in the tree).
- **Anomalies**: Fall into sparse regions and are isolated after very few splits (near the root).
`,
        examples: [
          {
            title: 'Isolation Forest Pipeline in Scikit-Learn',
            codeSnippet: `from sklearn.ensemble import IsolationForest
import numpy as np

# contamination=0.01 indicates expected 1% extreme anomalies
iso_forest = IsolationForest(
    n_estimators=100,
    contamination=0.01,
    random_state=42,
    n_jobs=-1
)

iso_forest.fit(X_train_features)
# Negative anomaly score indicates outliers
anomaly_scores = iso_forest.decision_function(X_test_features)
is_anomaly = iso_forest.predict(X_test_features) == -1`,
            explanation: 'Trains an Isolation Forest to flag transactions in sparse regions without labels.',
          },
        ],
        commonMistakes: [
          'Hard-declining all anomalies without verifying if they are high-net-worth VIPs.',
          'Setting contamination to default 0.1 (10%) when true fraud is only 0.1% (causing massive false alarms).',
        ],
        checkQuestions: [
          {
            question: 'Why do Isolation Forests isolate anomalies with shorter path lengths than inliers?',
            answer: 'Because anomalies reside in sparse, low-density feature space regions, so random splits separate them from other points in very few cuts.',
          },
        ],
        approvedResources,
      };
    }

    // 9. Real-Time Serving, FastAPI & Redis Feature Store
    if (key.includes('realtime') || key.includes('fastapi') || key.includes('redis') || key.includes('serving')) {
      const approvedResources = RESOURCE_LIBRARY_SEED.filter(r => r.associatedSkills.includes('Python') || r.associatedSkills.includes('FastAPI'));
      return {
        topicKey: 'realtime_serving_redis',
        title: 'Real-Time Serving, FastAPI & Redis Feature Store',
        category: 'system_design',
        estimatedMinutes: 50,
        conceptsCovered: [
          'Payment Network SLA & 50ms Latency Budget',
          'FastAPI Asynchronous Request Handling',
          'Redis In-Memory Feature Store Pipelines',
          'Model Serialization with Treelite & ONNX Runtime',
          'Fallback Heuristic Risk Rules & Circuit Breakers',
        ],
        learningObjectives: {
          summary:
            'In this topic, you will learn how to build low-latency real-time inference microservices. Payment card networks enforce strict SLAs: the entire risk decision must execute in under 50ms roundtrip. You will build asynchronous FastAPI services, integrate Redis as an in-memory feature store for 5ms velocity lookups, serialize models with ONNX/Treelite, and build fallback circuit breakers.',
          coreConcepts: [
            'Card authorization network SLAs and latency budgets (p99 < 50ms)',
            'Asynchronous Python microservices with FastAPI, Uvicorn, and Pydantic validation',
            'In-memory feature stores using Redis pipelines for sub-5ms rolling aggregate lookups',
            'Model acceleration: serializing tree models with Treelite or ONNX Runtime for 10x faster inference',
            'Graceful degradation: fallback heuristic rule engines and circuit breakers under load',
          ],
          subtopics: [
            {
              title: 'Latency Budgeting & Payment SLAs',
              description: 'Deconstructing the 100ms authorization window: network transport, feature lookup, model scoring, and decision response.',
            },
            {
              title: 'FastAPI Microservice Architecture',
              description: 'Building async POST /v1/evaluate-transaction endpoints with strict schema validation and error boundaries.',
            },
            {
              title: 'Redis In-Memory Feature Store',
              description: 'Using Redis hashes and sorted sets with TTL expiration to query rolling 10m velocity in under 3 milliseconds.',
            },
            {
              title: 'Circuit Breakers & Graceful Degradation',
              description: 'Deploying fallback heuristic rules when Redis or the ML service experiences timeouts to prevent checkout blocking.',
            },
          ],
          focusAreas: [
            'Never perform blocking disk I/O or unindexed database queries inside the request lifecycle.',
            'Benchmark p99 latency (the slowest 1% of transactions) rather than mean latency, as payment gateways timeout on the tail.',
            'Serialize models into compiled C-libraries (Treelite) to eliminate Python GIL overhead.',
          ],
          learningOutcomes: [
            'Build a production-grade FastAPI risk scoring service achieving p99 latency < 35ms.',
            'Integrate Redis pipelines for instantaneous velocity feature retrieval.',
            'Implement resilient fallback mechanisms that protect revenue during upstream outages.',
            'Defend low-latency architecture choices in FinTech system design interviews.',
          ],
        },
        conceptsMarkdown: `### Real-Time Serving, FastAPI & Redis Feature Store

Payment gateways (Visa, Mastercard, Stripe, Adyen) enforce hard timeouts: the entire authorization request must complete in **under 100 milliseconds**.
Within that 100ms, your ML risk engine is allocated **30 to 50ms maximum**:
- 10ms: Network transit & JSON parsing
- 5ms: In-memory feature retrieval (Redis)
- 15ms: Model inference (XGBoost / Treelite)
- 10ms: Rule evaluation & decision emission

\`\`\`python
# Example Redis pipeline for sub-5ms velocity lookup
async def get_velocity_features(redis_client, user_id: str):
    pipe = redis_client.pipeline()
    pipe.zcount(f"tx:{user_id}", "-inf", "+inf") # 10-minute count
    pipe.hget(f"user:{user_id}", "avg_amount")
    results = await pipe.execute()
    return {"tx_count_10m": results[0], "avg_amount": float(results[1] or 0.0)}
\`\`\`
`,
        examples: [
          {
            title: 'FastAPI Low-Latency Evaluation Endpoint',
            codeSnippet: `from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import time

app = FastAPI()

class TransactionRequest(BaseModel):
    transaction_id: str
    user_id: str
    card_token: str
    amount: float
    mcc: str

@app.post("/v1/evaluate-transaction")
async def evaluate_transaction(req: TransactionRequest):
    start = time.perf_counter()
    # 1. Fetch velocity from Redis (< 5ms)
    # 2. Score with compiled model (< 15ms)
    risk_score = 0.012 # Example calibrated probability
    
    decision = "APPROVE" if risk_score < 0.15 else ("CHALLENGE_3DS" if risk_score < 0.60 else "DECLINE")
    latency_ms = (time.perf_counter() - start) * 1000
    
    return {
        "transaction_id": req.transaction_id,
        "risk_score": risk_score,
        "decision": decision,
        "latency_ms": round(latency_ms, 2)
    }`,
            explanation: 'Sub-30ms decision endpoint returning approve, 3D secure step-up, or decline.',
          },
        ],
        commonMistakes: [
          'Querying SQL relational databases synchronously during payment authorization.',
          'Relying on raw Python tree prediction when Treelite or ONNX runtime provides a 10x speedup.',
          'Lacking a fallback heuristic rule engine when Redis encounters temporary network blips.',
        ],
        checkQuestions: [
          {
            question: 'Why is Redis preferred over PostgreSQL for real-time fraud feature stores?',
            answer: 'Because Redis stores data entirely in RAM with single-digit millisecond latency, meeting the strict <50ms payment authorization network SLAs.',
          },
        ],
        approvedResources,
      };
    }

    // 10. Default / Dynamic Content Generator for other topics
    const cleanTitle = topicKey
      .split('_')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      topicKey,
      title: `${cleanTitle} — Core Principles & Engineering Standards`,
      category: 'system_design',
      estimatedMinutes: 45,
      conceptsCovered: [
        `${cleanTitle} Architecture & Core Foundations`,
        'Design Patterns & Implementation Mechanics',
        'State Management & Lifecycle',
        'Production Edge Cases & Failure Recovery',
        'Performance Profiling & Bottleneck Optimization',
        'Industry Standards for ' + targetRole,
      ],
      learningObjectives: {
        summary: `In this topic, you will master the principles, implementation patterns, and production standards of ${cleanTitle}. You will understand how it functions within enterprise architectures, which subtopics and components are required, and how to build reliable, high-performance systems for the role of ${targetRole}.`,
        coreConcepts: [
          `Fundamental architecture, design principles, and operational mechanics of ${cleanTitle}`,
          `How components interface and manage state lifecycle under concurrent load`,
          `Common failure modes, security considerations, and error handling patterns`,
          `Performance tuning, latency benchmarks, and profiling strategies for ${targetRole}`,
        ],
        subtopics: [
          {
            title: `${cleanTitle} Fundamentals & Core Architecture`,
            description: `Core primitives, data structures, and foundational configuration required to build with ${cleanTitle}.`,
          },
          {
            title: `Implementation Patterns & Lifecycle`,
            description: `Step-by-step design patterns, state management, and interaction protocols used in production.`,
          },
          {
            title: `Error Handling, Edge Cases & Resilience`,
            description: `How to build defensive mechanisms that gracefully recover from network drops, invalid inputs, or unexpected state transitions.`,
          },
          {
            title: `Optimization & Production Readiness`,
            description: `Benchmarking execution speed, memory footprint, and query execution plans for ${targetRole} standards.`,
          },
        ],
        focusAreas: [
          `Focus on understanding the core abstractions before diving into syntax details.`,
          `Pay close attention to error handling and defensive boundary checks.`,
          `Practice explaining architectural trade-offs between performance and simplicity.`,
        ],
        learningOutcomes: [
          `Build and maintain robust implementations of ${cleanTitle} in production codebases.`,
          `Diagnose and remediate bottlenecks and edge-case exceptions quickly.`,
          `Confidently discuss technical architectural decisions during technical interviews for ${targetRole}.`,
        ],
      },
      conceptsMarkdown: `### ${cleanTitle}: Technical Mastery & Core Concepts

This module builds practical expertise in **${cleanTitle}**, reverse-engineered from production standards for the role of **${targetRole}**.

#### Key Objectives:
1. Understand the core abstractions and state transitions of ${cleanTitle}.
2. Implement robust, scalable patterns resilient to production edge cases.
3. Master debugging, tracing, and metric evaluation.
`,
      examples: [
        {
          title: `Production Implementation of ${cleanTitle}`,
          codeSnippet: `// Idiomatic implementation pattern for ${cleanTitle}
export function initializeSystem(config) {
  const validated = validateConfig(config);
  return {
    status: 'ACTIVE',
    targetRole: '${targetRole}',
    timestamp: new Date().toISOString()
  };
}`,
          explanation: `Demonstrates clean lifecycle management and defensive validation for ${cleanTitle}.`,
        },
      ],
      commonMistakes: [
        `Failing to validate inputs before processing in ${cleanTitle}.`,
        'Ignoring error boundaries and exception propagation.',
        'Neglecting edge-case handling under concurrent load.',
      ],
      checkQuestions: [
        {
          question: `What is the primary architectural advantage of mastering ${cleanTitle}?`,
          answer: `It provides modular separation of concerns and deterministic behavior in ${targetRole} workflows.`,
        },
      ],
      approvedResources: RESOURCE_LIBRARY_SEED.slice(0, 3),
    };
  }
}

export const topicContentEngine = new TopicContentEngine();
