"""Master seed dataset for Indian government exam categories.

Structure per category:
    {"category": str, "exams": [exam, ...]}
Structure per exam:
    {"name": str, "exam_type": str, "subjects": [subject, ...]}  # subjects optional
Structure per subject:
    {"name": str, "chapters": [chapter, ...]}  # chapters optional
Chapter entries are either a plain string (chapter name, no topics) or:
    {"name": str, "topics": [str, ...]}
"""

SEED_DATA = [
    {
        "category": "SSC",
        "exams": [
            {
                "name": "SSC CGL",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "Quantitative Aptitude",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural Numbers",
                                    "Whole Numbers",
                                    "Integers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                    "Remainder",
                                    "Prime Numbers",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple Interest",
                                    "Compound Interest",
                                    "Ratio and Proportion",
                                    "Average",
                                    "Time and Work",
                                    "Time Speed Distance",
                                    "Mixture and Allegation",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Basic Algebra",
                                    "Linear Equation",
                                    "Quadratic Equation",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                    "Quadrilateral",
                                    "Polygon",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                    "Cylinder Cone Sphere",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Trigonometric Identities",
                                    "Heights and Distances",
                                ],
                            },
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                            {
                                "name": "Statistics",
                                "topics": [
                                    "Mean Median Mode",
                                    "Data Handling",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                    "Number Classification",
                                ],
                            },
                            {
                                "name": "Non-Verbal Reasoning",
                                "topics": [
                                    "Mirror Images",
                                    "Water Images",
                                    "Paper Folding",
                                    "Embedded Figures",
                                ],
                            },
                            {
                                "name": "Direction Sense",
                                "topics": [
                                    "Distance and Direction",
                                    "Shadow Based Problems",
                                ],
                            },
                            {
                                "name": "Puzzle",
                                "topics": [
                                    "Seating Arrangement",
                                    "Box Puzzle",
                                    "Floor Puzzle",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Noun",
                                    "Pronoun",
                                    "Verb",
                                    "Adjective",
                                    "Tense",
                                    "Active Passive Voice",
                                    "Direct Indirect Speech",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                    "Idioms",
                                ],
                            },
                            {
                                "name": "Idioms and Phrases",
                                "topics": [
                                    "Common Idioms",
                                    "Phrasal Verbs",
                                ],
                            },
                            {
                                "name": "Error Spotting",
                                "topics": [
                                    "Grammatical Errors",
                                    "Spotting Errors in Sentences",
                                ],
                            },
                            {
                                "name": "Sentence Improvement",
                                "topics": [
                                    "Sentence Correction",
                                    "Sentence Rearrangement",
                                ],
                            },
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient India",
                                    "Medieval India",
                                    "Modern India",
                                    "Freedom Movement",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Indian Geography",
                                    "World Geography",
                                    "Climate",
                                    "Rivers",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Parliament",
                                    "President",
                                    "Supreme Court",
                                ],
                            },
                            {
                                "name": "Economics",
                                "topics": [
                                    "Banking",
                                    "Inflation",
                                    "Budget",
                                    "GDP",
                                ],
                            },
                            {
                                "name": "Science",
                                "topics": [
                                    "Physics",
                                    "Chemistry",
                                    "Biology",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                    "Awards and Honours",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SSC CHSL",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "General Intelligence",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                    "Number Classification",
                                ],
                            },
                            {
                                "name": "Non-Verbal Reasoning",
                                "topics": [
                                    "Series",
                                    "Mirror Images",
                                    "Paper Folding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Direction Sense",
                                "topics": [
                                    "Distance and Direction",
                                    "Shadow Based Problems",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Quantitative Aptitude",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Heights and Distances",
                                ],
                            },
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                            {
                                "name": "Statistics",
                                "topics": [
                                    "Mean Median Mode",
                                    "Data Handling",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Language",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Economics",
                                "topics": [
                                    "Micro Economics",
                                    "Macro Economics",
                                    "Indian Economy",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SSC MTS",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Similarities and Differences",
                                "topics": [
                                    "Odd One Out",
                                    "Classification Based Questions",
                                ],
                            },
                            {
                                "name": "Space Visualization",
                                "topics": [
                                    "Mirror Images",
                                    "Paper Folding",
                                    "Cube and Dice",
                                ],
                            },
                            {
                                "name": "Problem Solving",
                                "topics": [
                                    "Analytical Problem Solving",
                                    "Puzzle Based Questions",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Numerical Aptitude",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Percentage",
                                "topics": [
                                    "Basic Percentage",
                                    "Percentage Change",
                                    "Applications",
                                ],
                            },
                            {
                                "name": "Ratio and Proportion",
                                "topics": [
                                    "Simple Ratio",
                                    "Compound Ratio",
                                    "Applications",
                                ],
                            },
                            {
                                "name": "Time and Work",
                                "topics": [
                                    "Work and Efficiency",
                                    "Pipes and Cisterns",
                                    "Combined Work",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General English",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Economics",
                                "topics": [
                                    "Micro Economics",
                                    "Macro Economics",
                                    "Indian Economy",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Science",
                                "topics": [
                                    "Physics",
                                    "Chemistry",
                                    "Biology",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SSC CPO",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Coded Relation",
                                    "Generation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                    "Number Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Knowledge and General Awareness",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Economics",
                                "topics": [
                                    "Micro Economics",
                                    "Macro Economics",
                                    "Indian Economy",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Quantitative Aptitude",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Identities",
                                    "Heights and Distances",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Comprehension",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Error Spotting",
                                "topics": [
                                    "Grammatical Errors",
                                    "Spotting Errors in Sentences",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SSC JE",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Science and Technology",
                                "topics": [
                                    "Space Technology",
                                    "Defence Technology",
                                    "IT and Digital India",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Engineering (Civil)",
                        "chapters": [
                            {
                                "name": "Building Materials",
                                "topics": [
                                    "Cement",
                                    "Bricks and Blocks",
                                    "Timber and Steel",
                                ],
                            },
                            {
                                "name": "Estimating Costing and Valuation",
                                "topics": [
                                    "Quantity Estimation",
                                    "Rate Analysis",
                                    "Valuation of Property",
                                ],
                            },
                            {
                                "name": "Surveying",
                                "topics": [
                                    "Chain Surveying",
                                    "Levelling",
                                    "Theodolite Survey",
                                ],
                            },
                            {
                                "name": "Soil Mechanics",
                                "topics": [
                                    "Soil Classification",
                                    "Bearing Capacity",
                                    "Compaction",
                                ],
                            },
                            {
                                "name": "Hydraulics",
                                "topics": [
                                    "Fluid Pressure",
                                    "Flow through Pipes",
                                    "Hydraulic Machines",
                                ],
                            },
                            {
                                "name": "Structural Engineering",
                                "topics": [
                                    "Design of Beams",
                                    "Columns",
                                    "Foundations",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Engineering (Mechanical)",
                        "chapters": [
                            {
                                "name": "Thermodynamics",
                                "topics": [
                                    "Laws of Thermodynamics",
                                    "Heat Engines",
                                    "Entropy",
                                ],
                            },
                            {
                                "name": "Fluid Mechanics",
                                "topics": [
                                    "Fluid Properties",
                                    "Bernoulli's Equation",
                                    "Flow Measurement",
                                ],
                            },
                            {
                                "name": "Theory of Machines",
                                "topics": [
                                    "Kinematics of Machines",
                                    "Gears and Gear Trains",
                                    "Cams",
                                ],
                            },
                            {
                                "name": "Strength of Materials",
                                "topics": [
                                    "Stress and Strain",
                                    "Bending Moment",
                                    "Shear Force",
                                ],
                            },
                            {
                                "name": "Production Engineering",
                                "topics": [
                                    "Manufacturing Processes",
                                    "Machine Tools",
                                    "Metrology",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Engineering (Electrical)",
                        "chapters": [
                            {
                                "name": "Electrical Circuit Laws",
                                "topics": [
                                    "Ohm's Law",
                                    "Kirchhoff's Laws",
                                    "Network Theorems",
                                ],
                            },
                            {
                                "name": "Electrical Machines",
                                "topics": [
                                    "DC Machines",
                                    "Transformers",
                                    "AC Motors",
                                ],
                            },
                            {
                                "name": "Power Systems",
                                "topics": [
                                    "Generation",
                                    "Transmission",
                                    "Distribution",
                                ],
                            },
                            {
                                "name": "Measurement and Measuring Instruments",
                                "topics": [
                                    "Electrical Measuring Instruments",
                                    "Errors in Measurement",
                                ],
                            },
                            {
                                "name": "Utilization of Electrical Energy",
                                "topics": [
                                    "Illumination",
                                    "Electric Heating",
                                    "Electric Traction",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SSC Stenographer",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Language and Comprehension",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SSC GD Constable",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Coded Relation",
                                    "Generation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Knowledge and General Awareness",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Elementary Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Heights and Distances",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English/Hindi",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SSC JHT",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "General Hindi",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Translation",
                                "topics": [
                                    "Literal Translation",
                                    "Idiomatic Translation",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General English",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Translation",
                                "topics": [
                                    "Literal Translation",
                                    "Idiomatic Translation",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Translation and Essay",
                        "chapters": [
                            {
                                "name": "Hindi to English Translation",
                                "topics": [
                                    "Sentence Translation",
                                    "Idiomatic Translation",
                                ],
                            },
                            {
                                "name": "English to Hindi Translation",
                                "topics": [
                                    "Sentence Translation",
                                    "Idiomatic Translation",
                                ],
                            },
                            {
                                "name": "Essay Writing",
                                "topics": [
                                    "Structure of an Essay",
                                    "Common Essay Topics",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SSC Selection Post",
                "exam_type": "SSC",
                "subjects": [
                    {
                        "name": "General Intelligence",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                    "Number Classification",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Quantitative Aptitude",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Heights and Distances",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Language",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Economics",
                                "topics": [
                                    "Micro Economics",
                                    "Macro Economics",
                                    "Indian Economy",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "Banking",
        "exams": [
            {
                "name": "IBPS PO",
                "exam_type": "BANKING",
                "subjects": [
                    {
                        "name": "Quantitative Aptitude",
                        "chapters": [
                            {
                                "name": "Percentage",
                                "topics": [
                                    "Basic Percentage",
                                    "Percentage Change",
                                    "Applications",
                                ],
                            },
                            {
                                "name": "Profit Loss",
                                "topics": [
                                    "Cost Price and Selling Price",
                                    "Discount",
                                    "Successive Profit Loss",
                                ],
                            },
                            {
                                "name": "SI CI",
                                "topics": [
                                    "Simple Interest",
                                    "Compound Interest",
                                    "Difference between SI and CI",
                                ],
                            },
                            {
                                "name": "Time Work",
                                "topics": [
                                    "Work and Efficiency",
                                    "Pipes and Cisterns",
                                ],
                            },
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                            {
                                "name": "Data Sufficiency",
                                "topics": [
                                    "Two Statement Analysis",
                                    "Additional Data Requirement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Reasoning",
                        "chapters": [
                            {
                                "name": "Puzzle",
                                "topics": [
                                    "Seating Arrangement Puzzle",
                                    "Floor Puzzle",
                                    "Box Based Puzzle",
                                ],
                            },
                            {
                                "name": "Seating Arrangement",
                                "topics": [
                                    "Linear Arrangement",
                                    "Circular Arrangement",
                                    "Complex Arrangement",
                                ],
                            },
                            {
                                "name": "Syllogism",
                                "topics": [
                                    "Categorical Syllogism",
                                    "Venn Diagram Method",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Coded Relation",
                                    "Generation Based Questions",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Inequality",
                                "topics": [
                                    "Coded Inequality",
                                    "Direct Inequality",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English",
                        "chapters": [
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                            {
                                "name": "Error Detection",
                                "topics": [
                                    "Grammatical Error Spotting",
                                    "Sentence Correction",
                                ],
                            },
                            {
                                "name": "Sentence Rearrangement",
                                "topics": [
                                    "Para Jumbles",
                                    "Sentence Ordering",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                            {
                                "name": "Banking Terms",
                                "topics": [
                                    "NPA",
                                    "CRR and SLR",
                                    "Repo Rate",
                                ],
                            },
                            {
                                "name": "Awards and Honours",
                                "topics": [
                                    "National Awards",
                                    "International Awards",
                                    "Sports Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Banking Awareness",
                        "chapters": [
                            {
                                "name": "RBI",
                                "topics": [
                                    "Functions of RBI",
                                    "Monetary Policy Tools",
                                    "Regulatory Role",
                                ],
                            },
                            {
                                "name": "Banking System",
                                "topics": [
                                    "Structure of Indian Banking",
                                    "Cooperative Banks",
                                    "Payment Banks",
                                ],
                            },
                            {
                                "name": "Financial Markets",
                                "topics": [
                                    "Money Market",
                                    "Capital Market",
                                    "Regulatory Bodies",
                                ],
                            },
                            {
                                "name": "Loans",
                                "topics": [
                                    "Types of Loans",
                                    "Interest Rates",
                                    "Loan Recovery",
                                ],
                            },
                            {
                                "name": "Digital Banking",
                                "topics": [
                                    "Internet Banking",
                                    "UPI and Mobile Banking",
                                    "Digital Payment Security",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Computer Knowledge",
                        "chapters": [
                            {
                                "name": "Computer Fundamentals",
                                "topics": [
                                    "Hardware and Software",
                                    "Input Output Devices",
                                    "Number Systems in Computing",
                                ],
                            },
                            {
                                "name": "MS Office",
                                "topics": [
                                    "MS Word",
                                    "MS Excel",
                                    "MS PowerPoint",
                                ],
                            },
                            {
                                "name": "Internet and Networking",
                                "topics": [
                                    "Network Types",
                                    "IP Address",
                                    "Internet Protocols",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "IBPS Clerk",
                "exam_type": "BANKING",
                "subjects": [
                    {
                        "name": "Reasoning Ability",
                        "chapters": [
                            {
                                "name": "Puzzle",
                                "topics": [
                                    "Seating Arrangement Puzzle",
                                    "Floor Puzzle",
                                    "Box Based Puzzle",
                                ],
                            },
                            {
                                "name": "Seating Arrangement",
                                "topics": [
                                    "Linear Arrangement",
                                    "Circular Arrangement",
                                    "Complex Arrangement",
                                ],
                            },
                            {
                                "name": "Syllogism",
                                "topics": [
                                    "Categorical Syllogism",
                                    "Venn Diagram Method",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Coded Relation",
                                    "Generation Based Questions",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Inequality",
                                "topics": [
                                    "Coded Inequality",
                                    "Direct Inequality",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Numerical Ability",
                        "chapters": [
                            {
                                "name": "Simplification",
                                "topics": [
                                    "BODMAS Rule",
                                    "Fractions and Decimals",
                                    "Approximation",
                                ],
                            },
                            {
                                "name": "Number Series",
                                "topics": [
                                    "Missing Number Series",
                                    "Wrong Number Series",
                                ],
                            },
                            {
                                "name": "Quadratic Equations",
                                "topics": [
                                    "Roots of Equation",
                                    "Nature of Roots",
                                ],
                            },
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                            {
                                "name": "Percentage",
                                "topics": [
                                    "Basic Percentage",
                                    "Percentage Change",
                                    "Applications",
                                ],
                            },
                            {
                                "name": "Profit and Loss",
                                "topics": [
                                    "Cost Price and Selling Price",
                                    "Discount",
                                    "Successive Profit Loss",
                                ],
                            },
                            {
                                "name": "Data Sufficiency",
                                "topics": [
                                    "Two Statement Analysis",
                                    "Additional Data Requirement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Language",
                        "chapters": [
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                            {
                                "name": "Error Detection",
                                "topics": [
                                    "Grammatical Error Spotting",
                                    "Sentence Correction",
                                ],
                            },
                            {
                                "name": "Sentence Rearrangement",
                                "topics": [
                                    "Para Jumbles",
                                    "Sentence Ordering",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General/Financial Awareness",
                        "chapters": [
                            {
                                "name": "Banking Terms",
                                "topics": [
                                    "NPA",
                                    "CRR and SLR",
                                    "Repo Rate",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                            {
                                "name": "Financial Awareness",
                                "topics": [
                                    "Financial Institutions",
                                    "Capital Markets",
                                    "Government Schemes",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Computer Aptitude",
                        "chapters": [
                            {
                                "name": "Computer Fundamentals",
                                "topics": [
                                    "Hardware and Software",
                                    "Input Output Devices",
                                    "Number Systems in Computing",
                                ],
                            },
                            {
                                "name": "MS Office",
                                "topics": [
                                    "MS Word",
                                    "MS Excel",
                                    "MS PowerPoint",
                                ],
                            },
                            {
                                "name": "Internet and Networking",
                                "topics": [
                                    "Network Types",
                                    "IP Address",
                                    "Internet Protocols",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SBI PO",
                "exam_type": "BANKING",
                "subjects": [
                    {
                        "name": "Reasoning",
                        "chapters": [
                            {
                                "name": "Puzzle",
                                "topics": [
                                    "Seating Arrangement Puzzle",
                                    "Floor Puzzle",
                                    "Box Based Puzzle",
                                ],
                            },
                            {
                                "name": "Seating Arrangement",
                                "topics": [
                                    "Linear Arrangement",
                                    "Circular Arrangement",
                                    "Complex Arrangement",
                                ],
                            },
                            {
                                "name": "Syllogism",
                                "topics": [
                                    "Categorical Syllogism",
                                    "Venn Diagram Method",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Coded Relation",
                                    "Generation Based Questions",
                                ],
                            },
                            {
                                "name": "Inequality",
                                "topics": [
                                    "Coded Inequality",
                                    "Direct Inequality",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Data Analysis and Interpretation",
                        "chapters": [
                            {
                                "name": "Tabulation",
                                "topics": [
                                    "Data Arrangement",
                                    "Missing Data Calculation",
                                ],
                            },
                            {
                                "name": "Bar Graph",
                                "topics": [
                                    "Simple Bar Graph",
                                    "Comparative Bar Graph",
                                    "Data Reading",
                                ],
                            },
                            {
                                "name": "Pie Chart",
                                "topics": [
                                    "Reading Pie Charts",
                                    "Percentage Distribution",
                                ],
                            },
                            {
                                "name": "Caselet",
                                "topics": [
                                    "Data Interpretation from Passages",
                                    "Multi-Parameter Caselets",
                                ],
                            },
                            {
                                "name": "Data Sufficiency",
                                "topics": [
                                    "Two Statement Analysis",
                                    "Additional Data Requirement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Language",
                        "chapters": [
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Para Jumbles",
                                "topics": [
                                    "Sentence Rearrangement",
                                    "Paragraph Coherence",
                                ],
                            },
                            {
                                "name": "Error Spotting",
                                "topics": [
                                    "Grammatical Errors",
                                    "Punctuation Errors",
                                ],
                            },
                            {
                                "name": "Fillers",
                                "topics": [
                                    "Single Blank Fillers",
                                    "Double Blank Fillers",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General/Economy/Banking Awareness",
                        "chapters": [
                            {
                                "name": "Banking Awareness",
                                "topics": [
                                    "Types of Banks",
                                    "Monetary Policy",
                                    "Banking Terms",
                                ],
                            },
                            {
                                "name": "Economic Survey",
                                "topics": [
                                    "Key Economic Indicators",
                                    "Sector-wise Review",
                                    "Annual Themes",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Computer Aptitude",
                        "chapters": [
                            {
                                "name": "Computer Fundamentals",
                                "topics": [
                                    "Hardware and Software",
                                    "Input Output Devices",
                                    "Number Systems in Computing",
                                ],
                            },
                            {
                                "name": "Internet Basics",
                                "topics": [
                                    "World Wide Web",
                                    "Search Engines",
                                    "Internet Protocols",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "SBI Clerk",
                "exam_type": "BANKING",
                "subjects": [
                    {
                        "name": "Reasoning Ability",
                        "chapters": [
                            {
                                "name": "Puzzle",
                                "topics": [
                                    "Seating Arrangement Puzzle",
                                    "Floor Puzzle",
                                    "Box Based Puzzle",
                                ],
                            },
                            {
                                "name": "Seating Arrangement",
                                "topics": [
                                    "Linear Arrangement",
                                    "Circular Arrangement",
                                    "Complex Arrangement",
                                ],
                            },
                            {
                                "name": "Syllogism",
                                "topics": [
                                    "Categorical Syllogism",
                                    "Venn Diagram Method",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Coded Relation",
                                    "Generation Based Questions",
                                ],
                            },
                            {
                                "name": "Inequality",
                                "topics": [
                                    "Coded Inequality",
                                    "Direct Inequality",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Numerical Ability",
                        "chapters": [
                            {
                                "name": "Simplification",
                                "topics": [
                                    "BODMAS Rule",
                                    "Fractions and Decimals",
                                    "Approximation",
                                ],
                            },
                            {
                                "name": "Number Series",
                                "topics": [
                                    "Missing Number Series",
                                    "Wrong Number Series",
                                ],
                            },
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                            {
                                "name": "Percentage",
                                "topics": [
                                    "Basic Percentage",
                                    "Percentage Change",
                                    "Applications",
                                ],
                            },
                            {
                                "name": "Data Sufficiency",
                                "topics": [
                                    "Two Statement Analysis",
                                    "Additional Data Requirement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Language",
                        "chapters": [
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                            {
                                "name": "Error Detection",
                                "topics": [
                                    "Grammatical Error Spotting",
                                    "Sentence Correction",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General/Financial Awareness",
                        "chapters": [
                            {
                                "name": "Banking Awareness",
                                "topics": [
                                    "Types of Banks",
                                    "Monetary Policy",
                                    "Banking Terms",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "RBI Assistant",
                "exam_type": "BANKING",
                "subjects": [
                    {
                        "name": "Reasoning",
                        "chapters": [
                            {
                                "name": "Puzzle",
                                "topics": [
                                    "Seating Arrangement Puzzle",
                                    "Floor Puzzle",
                                    "Box Based Puzzle",
                                ],
                            },
                            {
                                "name": "Seating Arrangement",
                                "topics": [
                                    "Linear Arrangement",
                                    "Circular Arrangement",
                                    "Complex Arrangement",
                                ],
                            },
                            {
                                "name": "Syllogism",
                                "topics": [
                                    "Categorical Syllogism",
                                    "Venn Diagram Method",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Coded Relation",
                                    "Generation Based Questions",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Inequality",
                                "topics": [
                                    "Coded Inequality",
                                    "Direct Inequality",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Numerical Ability",
                        "chapters": [
                            {
                                "name": "Simplification",
                                "topics": [
                                    "BODMAS Rule",
                                    "Fractions and Decimals",
                                    "Approximation",
                                ],
                            },
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                            {
                                "name": "Number Series",
                                "topics": [
                                    "Missing Number Series",
                                    "Wrong Number Series",
                                ],
                            },
                            {
                                "name": "Quadratic Equation",
                                "topics": [
                                    "Roots of Equation",
                                    "Nature of Roots",
                                    "Formation of Equation",
                                ],
                            },
                            {
                                "name": "Data Sufficiency",
                                "topics": [
                                    "Two Statement Analysis",
                                    "Additional Data Requirement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Language",
                        "chapters": [
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                            {
                                "name": "Spotting Errors",
                                "topics": [
                                    "Grammatical Errors",
                                    "Subject Verb Agreement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Banking Awareness",
                                "topics": [
                                    "Types of Banks",
                                    "Monetary Policy",
                                    "Banking Terms",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Computer Knowledge",
                        "chapters": [
                            {
                                "name": "Computer Fundamentals",
                                "topics": [
                                    "Hardware and Software",
                                    "Input Output Devices",
                                    "Number Systems in Computing",
                                ],
                            },
                            {
                                "name": "MS Office",
                                "topics": [
                                    "MS Word",
                                    "MS Excel",
                                    "MS PowerPoint",
                                ],
                            },
                            {
                                "name": "Internet",
                                "topics": [
                                    "Web Browsers",
                                    "Email Basics",
                                    "Internet Security",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "RBI Grade B",
                "exam_type": "BANKING",
                "subjects": [
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Banking and Financial Awareness",
                                "topics": [
                                    "Monetary Policy",
                                    "Financial Institutions",
                                    "Banking Reforms",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English (Writing Skills)",
                        "chapters": [
                            {
                                "name": "Essay Writing",
                                "topics": [
                                    "Structure of an Essay",
                                    "Common Essay Topics",
                                ],
                            },
                            {
                                "name": "Precis Writing",
                                "topics": [
                                    "Summarization Technique",
                                    "Key Point Extraction",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Quantitative Aptitude and Reasoning",
                        "chapters": [
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                            {
                                "name": "Reasoning",
                                "topics": [
                                    "Verbal Reasoning",
                                    "Non-Verbal Reasoning",
                                    "Analytical Reasoning",
                                ],
                            },
                            {
                                "name": "Quantitative Techniques",
                                "topics": [
                                    "Data Interpretation",
                                    "Simplification",
                                    "Approximation",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Finance and Management",
                        "chapters": [
                            {
                                "name": "Financial System",
                                "topics": [
                                    "Structure of Financial System",
                                    "Financial Institutions",
                                    "Financial Instruments",
                                ],
                            },
                            {
                                "name": "Financial Markets",
                                "topics": [
                                    "Money Market",
                                    "Capital Market",
                                    "Regulatory Bodies",
                                ],
                            },
                            {
                                "name": "Risk Management",
                                "topics": [
                                    "Types of Risk",
                                    "Risk Mitigation",
                                    "Basel Norms",
                                ],
                            },
                            {
                                "name": "Management Concepts",
                                "topics": [
                                    "Planning and Organizing",
                                    "Leadership",
                                    "Decision Making",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Economic and Social Issues",
                        "chapters": [
                            {
                                "name": "Indian Economy",
                                "topics": [
                                    "National Income",
                                    "Planning and Development",
                                    "Sectors of Economy",
                                ],
                            },
                            {
                                "name": "Social Structure",
                                "topics": [
                                    "Caste and Class",
                                    "Social Institutions",
                                ],
                            },
                            {
                                "name": "Globalization",
                                "topics": [
                                    "Trade Liberalization",
                                    "FDI",
                                    "WTO",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "NABARD Grade A",
                "exam_type": "BANKING",
                "subjects": [
                    {
                        "name": "Reasoning",
                        "chapters": [
                            {
                                "name": "Puzzle",
                                "topics": [
                                    "Seating Arrangement Puzzle",
                                    "Floor Puzzle",
                                    "Box Based Puzzle",
                                ],
                            },
                            {
                                "name": "Seating Arrangement",
                                "topics": [
                                    "Linear Arrangement",
                                    "Circular Arrangement",
                                    "Complex Arrangement",
                                ],
                            },
                            {
                                "name": "Syllogism",
                                "topics": [
                                    "Categorical Syllogism",
                                    "Venn Diagram Method",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Coded Relation",
                                    "Generation Based Questions",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Inequality",
                                "topics": [
                                    "Coded Inequality",
                                    "Direct Inequality",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English Language",
                        "chapters": [
                            {
                                "name": "Reading Comprehension",
                                "topics": [
                                    "Passage Analysis",
                                    "Inference Questions",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Cloze Test",
                                "topics": [
                                    "Vocabulary Based Cloze",
                                    "Grammar Based Cloze",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Quantitative Aptitude",
                        "chapters": [
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                            {
                                "name": "Simplification",
                                "topics": [
                                    "BODMAS Rule",
                                    "Fractions and Decimals",
                                    "Approximation",
                                ],
                            },
                            {
                                "name": "Number Series",
                                "topics": [
                                    "Missing Number Series",
                                    "Wrong Number Series",
                                ],
                            },
                            {
                                "name": "Data Sufficiency",
                                "topics": [
                                    "Two Statement Analysis",
                                    "Additional Data Requirement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Computer Knowledge",
                        "chapters": [
                            {
                                "name": "Computer Fundamentals",
                                "topics": [
                                    "Hardware and Software",
                                    "Input Output Devices",
                                    "Number Systems in Computing",
                                ],
                            },
                            {
                                "name": "Internet Basics",
                                "topics": [
                                    "World Wide Web",
                                    "Search Engines",
                                    "Internet Protocols",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Banking Awareness",
                                "topics": [
                                    "Types of Banks",
                                    "Monetary Policy",
                                    "Banking Terms",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Agriculture and Rural Development",
                        "chapters": [
                            {
                                "name": "Agricultural Economics",
                                "topics": [
                                    "Farm Economics",
                                    "Agricultural Pricing",
                                    "Land Reforms",
                                ],
                            },
                            {
                                "name": "Rural Development Programmes",
                                "topics": [
                                    "MGNREGA",
                                    "PMGSY",
                                    "Rural Livelihood Missions",
                                ],
                            },
                            {
                                "name": "Agricultural Extension",
                                "topics": [
                                    "Extension Methods",
                                    "Farmer Training Programmes",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Economic and Social Issues",
                        "chapters": [
                            {
                                "name": "Indian Economy",
                                "topics": [
                                    "National Income",
                                    "Planning and Development",
                                    "Sectors of Economy",
                                ],
                            },
                            {
                                "name": "Rural Society",
                                "topics": [
                                    "Rural Social Structure",
                                    "Agrarian Relations",
                                ],
                            },
                            {
                                "name": "Social Issues",
                                "topics": [
                                    "Poverty",
                                    "Unemployment",
                                    "Social Inequality",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "UPSC",
        "exams": [
            {
                "name": "UPSC Civil Services",
                "exam_type": "UPSC",
                "subjects": [
                    {
                        "name": "History",
                        "chapters": [
                            {
                                "name": "Ancient History",
                                "topics": [
                                    "Indus Valley Civilization",
                                    "Vedic Period",
                                    "Maurya Empire",
                                ],
                            },
                            {
                                "name": "Medieval History",
                                "topics": [
                                    "Delhi Sultanate",
                                    "Mughal Empire",
                                    "Bhakti and Sufi Movements",
                                ],
                            },
                            {
                                "name": "Modern History",
                                "topics": [
                                    "1857 Revolt",
                                    "INC Formation",
                                    "Gandhi Era",
                                    "Freedom Movement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Polity",
                        "chapters": [
                            {
                                "name": "Constitution",
                                "topics": [
                                    "Preamble",
                                    "Fundamental Rights and Duties",
                                    "Amendment Procedure",
                                ],
                            },
                            {
                                "name": "Fundamental Rights",
                                "topics": [
                                    "Right to Equality",
                                    "Right to Freedom",
                                    "Right to Constitutional Remedies",
                                ],
                            },
                            {
                                "name": "Parliament",
                                "topics": [
                                    "Lok Sabha",
                                    "Rajya Sabha",
                                    "Legislative Process",
                                ],
                            },
                            {
                                "name": "Judiciary",
                                "topics": [
                                    "Supreme Court",
                                    "High Courts",
                                    "Judicial Review",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Geography",
                        "chapters": [
                            {
                                "name": "Physical Geography",
                                "topics": [
                                    "Landforms",
                                    "Climate",
                                    "Oceanography",
                                ],
                            },
                            {
                                "name": "Indian Geography",
                                "topics": [
                                    "Physical Features",
                                    "Rivers and Mountains",
                                    "Climate",
                                ],
                            },
                            {
                                "name": "World Geography",
                                "topics": [
                                    "Continents",
                                    "Oceans",
                                    "Climate Zones",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Economics",
                        "chapters": [
                            {
                                "name": "Basic Concepts",
                                "topics": [
                                    "Demand and Supply",
                                    "Cost and Revenue",
                                    "Market Equilibrium",
                                ],
                            },
                            {
                                "name": "Indian Economy",
                                "topics": [
                                    "National Income",
                                    "Planning and Development",
                                    "Sectors of Economy",
                                ],
                            },
                            {
                                "name": "Union Budget",
                                "topics": [
                                    "Budget Process",
                                    "Types of Deficit",
                                    "Budget Terms",
                                ],
                            },
                            {
                                "name": "Economic Survey",
                                "topics": [
                                    "Key Economic Indicators",
                                    "Sector-wise Review",
                                    "Annual Themes",
                                ],
                            },
                            {
                                "name": "Five Year Plans",
                                "topics": [
                                    "Objectives",
                                    "Key Plans Overview",
                                    "NITI Aayog",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Environment",
                        "chapters": [
                            {
                                "name": "Ecology Basics",
                                "topics": [
                                    "Ecosystem Structure",
                                    "Food Chain and Food Web",
                                    "Energy Flow",
                                ],
                            },
                            {
                                "name": "Biodiversity",
                                "topics": [
                                    "Types of Biodiversity",
                                    "Hotspots in India",
                                    "Conservation Methods",
                                ],
                            },
                            {
                                "name": "Climate Change",
                                "topics": [
                                    "Causes and Effects",
                                    "Global Warming",
                                    "International Agreements",
                                ],
                            },
                            {
                                "name": "Environmental Pollution",
                                "topics": [
                                    "Air Pollution",
                                    "Water Pollution",
                                    "Soil Pollution",
                                ],
                            },
                            {
                                "name": "Conservation",
                                "topics": [
                                    "Protected Areas",
                                    "Wildlife Conservation Acts",
                                    "Afforestation",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Science",
                        "chapters": [
                            {
                                "name": "Physics Basics",
                                "topics": [
                                    "Motion and Force",
                                    "Energy",
                                    "Electricity",
                                ],
                            },
                            {
                                "name": "Chemistry Basics",
                                "topics": [
                                    "States of Matter",
                                    "Chemical Reactions",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology Basics",
                                "topics": [
                                    "Cell Structure",
                                    "Classification of Organisms",
                                    "Human Body Systems",
                                ],
                            },
                            {
                                "name": "Science and Technology Current Developments",
                                "topics": [
                                    "Recent Innovations",
                                    "ISRO Missions",
                                    "Government Tech Initiatives",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Current Affairs",
                        "chapters": [
                            {
                                "name": "National Affairs",
                                "topics": [
                                    "Government Policies",
                                    "National Appointments",
                                    "National Events",
                                ],
                            },
                            {
                                "name": "International Affairs",
                                "topics": [
                                    "International Organizations",
                                    "Global Summits",
                                    "Bilateral Relations",
                                ],
                            },
                            {
                                "name": "Government Schemes",
                                "topics": [
                                    "Welfare Schemes",
                                    "Financial Inclusion Schemes",
                                    "Skill Development Schemes",
                                ],
                            },
                            {
                                "name": "Awards and Honours",
                                "topics": [
                                    "National Awards",
                                    "International Awards",
                                    "Sports Awards",
                                ],
                            },
                            {
                                "name": "Sports",
                                "topics": [
                                    "National Sports Awards",
                                    "International Tournaments",
                                    "Sports Personalities",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "UPSC CDS",
                "exam_type": "UPSC",
                "subjects": [
                    {
                        "name": "English",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Knowledge",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "General Science",
                                "topics": [
                                    "Physics",
                                    "Chemistry",
                                    "Biology",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Elementary Mathematics",
                        "chapters": [
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Identities",
                                    "Heights and Distances",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "UPSC NDA",
                "exam_type": "UPSC",
                "subjects": [
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Identities",
                                    "Heights and Distances",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Calculus",
                                "topics": [
                                    "Limits",
                                    "Differentiation",
                                    "Integration",
                                ],
                            },
                            {
                                "name": "Statistics",
                                "topics": [
                                    "Measures of Central Tendency",
                                    "Measures of Dispersion",
                                    "Correlation",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Ability Test",
                        "chapters": [
                            {
                                "name": "English",
                                "topics": [
                                    "Grammar",
                                    "Vocabulary",
                                    "Comprehension",
                                ],
                            },
                            {
                                "name": "General Knowledge",
                                "topics": [
                                    "History",
                                    "Geography",
                                    "Polity",
                                    "Current Affairs",
                                ],
                            },
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "UPSC CAPF",
                "exam_type": "UPSC",
                "subjects": [
                    {
                        "name": "General Studies",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Economics",
                                "topics": [
                                    "Micro Economics",
                                    "Macro Economics",
                                    "Indian Economy",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Essay and Comprehension",
                        "chapters": [
                            {
                                "name": "Essay Writing",
                                "topics": [
                                    "Structure of an Essay",
                                    "Common Essay Topics",
                                ],
                            },
                            {
                                "name": "Precis Writing",
                                "topics": [
                                    "Summarization Technique",
                                    "Key Point Extraction",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "Teaching",
        "exams": [
            {
                "name": "CTET",
                "exam_type": "CTET",
                "subjects": [
                    {
                        "name": "Child Development",
                        "chapters": [
                            {
                                "name": "Learning Theory",
                                "topics": [
                                    "Piaget Theory",
                                    "Vygotsky Theory",
                                ],
                            },
                            {
                                "name": "Intelligence",
                                "topics": [
                                    "Types of Intelligence",
                                    "Multiple Intelligence Theory",
                                ],
                            },
                            {
                                "name": "Inclusive Education",
                                "topics": [
                                    "Children with Special Needs",
                                    "Inclusive Classroom Practices",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Measurement",
                                "topics": [
                                    "Units of Measurement",
                                    "Length Mass Time",
                                    "Conversion",
                                ],
                            },
                            {
                                "name": "Data Handling",
                                "topics": [
                                    "Tables and Graphs",
                                    "Pictographs",
                                    "Bar Charts",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language",
                        "chapters": [
                            {
                                "name": "Language Comprehension",
                                "topics": [
                                    "Passage Reading",
                                    "Vocabulary in Context",
                                ],
                            },
                            {
                                "name": "Pedagogy of Language Development",
                                "topics": [
                                    "Language Acquisition",
                                    "Teaching Methods for Language",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Environmental Studies",
                        "chapters": [
                            {
                                "name": "Family and Friends",
                                "topics": [
                                    "Family Relationships",
                                    "Friendship and Cooperation",
                                ],
                            },
                            {
                                "name": "Food",
                                "topics": [
                                    "Sources of Food",
                                    "Nutrients",
                                    "Food Safety",
                                ],
                            },
                            {
                                "name": "Shelter",
                                "topics": [
                                    "Types of Houses",
                                    "Materials Used",
                                ],
                            },
                            {
                                "name": "Water",
                                "topics": [
                                    "Sources of Water",
                                    "Water Conservation",
                                ],
                            },
                            {
                                "name": "Travel",
                                "topics": [
                                    "Modes of Transport",
                                    "Means of Communication",
                                ],
                            },
                            {
                                "name": "Things We Make and Do",
                                "topics": [
                                    "Craft and Activities",
                                    "Everyday Objects",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Science",
                        "chapters": [
                            {
                                "name": "Food",
                                "topics": [
                                    "Sources of Food",
                                    "Nutrients",
                                    "Food Safety",
                                ],
                            },
                            {
                                "name": "Materials",
                                "topics": [
                                    "Properties of Materials",
                                    "Natural and Synthetic Materials",
                                ],
                            },
                            {
                                "name": "The World of Living",
                                "topics": [
                                    "Plants",
                                    "Animals",
                                    "Habitats",
                                ],
                            },
                            {
                                "name": "Natural Phenomena",
                                "topics": [
                                    "Rain and Weather",
                                    "Day and Night",
                                    "Seasons",
                                ],
                            },
                            {
                                "name": "Natural Resources",
                                "topics": [
                                    "Forest Resources",
                                    "Water Resources",
                                    "Mineral Resources",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "STET",
                "exam_type": "STET",
                "subjects": [
                    {
                        "name": "Child Development and Pedagogy",
                        "chapters": [
                            {
                                "name": "Learning Theory",
                                "topics": [
                                    "Behaviourism",
                                    "Cognitivism",
                                    "Constructivism",
                                ],
                            },
                            {
                                "name": "Child Psychology",
                                "topics": [
                                    "Cognitive Development",
                                    "Emotional Development",
                                    "Behaviourism",
                                ],
                            },
                            {
                                "name": "Inclusive Education",
                                "topics": [
                                    "Children with Special Needs",
                                    "Inclusive Classroom Practices",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language I",
                        "chapters": [
                            {
                                "name": "Hindi Grammar",
                                "topics": [
                                    "Sandhi",
                                    "Samas",
                                    "Vakya Shuddhi",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language II",
                        "chapters": [
                            {
                                "name": "English Grammar",
                                "topics": [
                                    "Tenses",
                                    "Parts of Speech",
                                    "Sentence Correction",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Social Science",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Civics",
                                "topics": [
                                    "Local Government",
                                    "Fundamental Duties",
                                    "Citizenship",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "UPTET",
                "exam_type": "CTET",
                "subjects": [
                    {
                        "name": "Child Development and Pedagogy",
                        "chapters": [
                            {
                                "name": "Learning Theory",
                                "topics": [
                                    "Behaviourism",
                                    "Cognitivism",
                                    "Constructivism",
                                ],
                            },
                            {
                                "name": "Child Psychology",
                                "topics": [
                                    "Cognitive Development",
                                    "Emotional Development",
                                    "Behaviourism",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language I (Hindi)",
                        "chapters": [
                            {
                                "name": "Hindi Grammar",
                                "topics": [
                                    "Sandhi",
                                    "Samas",
                                    "Vakya Shuddhi",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language II (English/Sanskrit)",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Measurement",
                                "topics": [
                                    "Units of Measurement",
                                    "Length Mass Time",
                                    "Conversion",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Environmental Studies / Science and Social Studies",
                        "chapters": [
                            {
                                "name": "Science Basics",
                                "topics": [
                                    "Living and Non-Living Things",
                                    "Basic Scientific Concepts",
                                ],
                            },
                            {
                                "name": "Social Studies Basics",
                                "topics": [
                                    "History Basics",
                                    "Geography Basics",
                                    "Civics Basics",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "BTET",
                "exam_type": "CTET",
                "subjects": [
                    {
                        "name": "Child Development and Pedagogy",
                        "chapters": [
                            {
                                "name": "Learning Theory",
                                "topics": [
                                    "Behaviourism",
                                    "Cognitivism",
                                    "Constructivism",
                                ],
                            },
                            {
                                "name": "Child Psychology",
                                "topics": [
                                    "Cognitive Development",
                                    "Emotional Development",
                                    "Behaviourism",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language I",
                        "chapters": [
                            {
                                "name": "Hindi Grammar",
                                "topics": [
                                    "Sandhi",
                                    "Samas",
                                    "Vakya Shuddhi",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language II",
                        "chapters": [
                            {
                                "name": "English Grammar",
                                "topics": [
                                    "Tenses",
                                    "Parts of Speech",
                                    "Sentence Correction",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Measurement",
                                "topics": [
                                    "Units of Measurement",
                                    "Length Mass Time",
                                    "Conversion",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Environmental Studies",
                        "chapters": [
                            {
                                "name": "Science Basics",
                                "topics": [
                                    "Living and Non-Living Things",
                                    "Basic Scientific Concepts",
                                ],
                            },
                            {
                                "name": "Social Studies Basics",
                                "topics": [
                                    "History Basics",
                                    "Geography Basics",
                                    "Civics Basics",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "KVS",
                "exam_type": "CTET",
                "subjects": [
                    {
                        "name": "General Awareness and Current Affairs",
                        "chapters": [
                            {
                                "name": "National Affairs",
                                "topics": [
                                    "Government Policies",
                                    "National Appointments",
                                    "National Events",
                                ],
                            },
                            {
                                "name": "International Affairs",
                                "topics": [
                                    "International Organizations",
                                    "Global Summits",
                                    "Bilateral Relations",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Reasoning Ability",
                        "chapters": [
                            {
                                "name": "Verbal Reasoning",
                                "topics": [
                                    "Analogy",
                                    "Classification",
                                    "Coding Decoding",
                                ],
                            },
                            {
                                "name": "Non-Verbal Reasoning",
                                "topics": [
                                    "Series",
                                    "Mirror Images",
                                    "Paper Folding",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language Competency",
                        "chapters": [
                            {
                                "name": "Hindi Language",
                                "topics": [
                                    "Vyakaran",
                                    "Shabd Gyan",
                                    "Comprehension",
                                ],
                            },
                            {
                                "name": "English Language",
                                "topics": [
                                    "Grammar",
                                    "Vocabulary",
                                    "Reading Comprehension",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Teaching Aptitude and Pedagogy",
                        "chapters": [
                            {
                                "name": "Teaching Methods",
                                "topics": [
                                    "Lecture Method",
                                    "Activity Based Learning",
                                    "Child Centred Approach",
                                ],
                            },
                            {
                                "name": "Educational Psychology",
                                "topics": [
                                    "Learning Theories",
                                    "Motivation",
                                    "Classroom Management",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Subject Knowledge",
                        "chapters": [
                            {
                                "name": "Concerned Subject Content",
                                "topics": [
                                    "Core Syllabus Topics of the Selected Subject",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "NVS",
                "exam_type": "CTET",
                "subjects": [
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Reasoning Ability",
                        "chapters": [
                            {
                                "name": "Verbal Reasoning",
                                "topics": [
                                    "Analogy",
                                    "Classification",
                                    "Coding Decoding",
                                ],
                            },
                            {
                                "name": "Non-Verbal Reasoning",
                                "topics": [
                                    "Series",
                                    "Mirror Images",
                                    "Paper Folding",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General English/Hindi",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Computer Literacy",
                        "chapters": [
                            {
                                "name": "Computer Fundamentals",
                                "topics": [
                                    "Hardware and Software",
                                    "Input Output Devices",
                                    "Number Systems in Computing",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Teaching Aptitude",
                        "chapters": [
                            {
                                "name": "Teaching Methods",
                                "topics": [
                                    "Lecture Method",
                                    "Activity Based Learning",
                                    "Child Centred Approach",
                                ],
                            },
                            {
                                "name": "Educational Psychology",
                                "topics": [
                                    "Learning Theories",
                                    "Motivation",
                                    "Classroom Management",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Subject Knowledge",
                        "chapters": [
                            {
                                "name": "Concerned Subject Content",
                                "topics": [
                                    "Core Syllabus Topics of the Selected Subject",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "Railway",
        "exams": [
            {
                "name": "RRB NTPC",
                "exam_type": "RAILWAY",
                "subjects": [
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Reasoning",
                        "chapters": [
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                ],
                            },
                            {
                                "name": "Puzzle",
                                "topics": [
                                    "Seating Arrangement Puzzle",
                                    "Floor Puzzle",
                                    "Box Based Puzzle",
                                ],
                            },
                            {
                                "name": "Direction",
                                "topics": [
                                    "Direction Sense Test",
                                    "Distance and Direction",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                            {
                                "name": "Sports",
                                "topics": [
                                    "National Sports Awards",
                                    "International Tournaments",
                                    "Sports Personalities",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "RRB Group D",
                "exam_type": "RAILWAY",
                "subjects": [
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Alphabet Test",
                                "topics": [
                                    "Alphabet Series",
                                    "Letter Position",
                                    "Word Formation",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Life Science",
                                "topics": [
                                    "Cell Biology",
                                    "Human Body",
                                    "Ecology",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness and Current Affairs",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "RRB ALP",
                "exam_type": "RAILWAY",
                "subjects": [
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness on Current Affairs",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Basic Science and Engineering",
                        "chapters": [
                            {
                                "name": "Engineering Drawing",
                                "topics": [
                                    "Orthographic Projection",
                                    "Isometric Views",
                                    "Dimensioning",
                                ],
                            },
                            {
                                "name": "Units and Measurement",
                                "topics": [
                                    "SI Units",
                                    "Measurement Errors",
                                    "Dimensional Analysis",
                                ],
                            },
                            {
                                "name": "Levers and Simple Machines",
                                "topics": [
                                    "Types of Levers",
                                    "Mechanical Advantage",
                                    "Pulleys",
                                ],
                            },
                            {
                                "name": "Electrical and Electronics Basics",
                                "topics": [
                                    "Basic Circuit Theory",
                                    "Semiconductor Devices",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "RRB Technician",
                "exam_type": "RAILWAY",
                "subjects": [
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Basics of Computers and Applications",
                        "chapters": [
                            {
                                "name": "Computer Fundamentals",
                                "topics": [
                                    "Hardware and Software",
                                    "Input Output Devices",
                                    "Number Systems in Computing",
                                ],
                            },
                            {
                                "name": "Internet Basics",
                                "topics": [
                                    "World Wide Web",
                                    "Search Engines",
                                    "Internet Protocols",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "Defence",
        "exams": [
            {
                "name": "NDA",
                "exam_type": "DEFENCE",
                "subjects": [
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Identities",
                                    "Heights and Distances",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "English",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Knowledge",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Defence Awareness",
                                "topics": [
                                    "Indian Armed Forces",
                                    "Defence Exercises",
                                    "Defence Equipment",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "CDS",
                "exam_type": "DEFENCE",
                "subjects": [
                    {
                        "name": "English",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Knowledge",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "General Science",
                                "topics": [
                                    "Physics",
                                    "Chemistry",
                                    "Biology",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Elementary Mathematics",
                        "chapters": [
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                            {
                                "name": "Trigonometry",
                                "topics": [
                                    "Trigonometric Ratios",
                                    "Identities",
                                    "Heights and Distances",
                                ],
                            },
                            {
                                "name": "Mensuration",
                                "topics": [
                                    "Area and Perimeter",
                                    "Volume and Surface Area",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "AFCAT",
                "exam_type": "DEFENCE",
                "subjects": [
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Verbal Ability",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Vocabulary",
                                "topics": [
                                    "Synonyms",
                                    "Antonyms",
                                    "One Word Substitution",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Numerical Ability",
                        "chapters": [
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Reasoning and Military Aptitude Test",
                        "chapters": [
                            {
                                "name": "Verbal Reasoning",
                                "topics": [
                                    "Analogy",
                                    "Classification",
                                    "Coding Decoding",
                                ],
                            },
                            {
                                "name": "Non-Verbal Reasoning",
                                "topics": [
                                    "Series",
                                    "Mirror Images",
                                    "Paper Folding",
                                ],
                            },
                            {
                                "name": "Spatial Ability",
                                "topics": [
                                    "Mirror and Water Images",
                                    "Pattern Completion",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Agniveer",
                "exam_type": "DEFENCE",
                "subjects": [
                    {
                        "name": "General Knowledge",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Reasoning and General Intelligence",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "State Government Exams",
        "exams": [
            {
                "name": "BPSC",
                "exam_type": "BPSC",
                "subjects": [
                    {
                        "name": "General Studies",
                        "chapters": [
                            {
                                "name": "Indian History",
                                "topics": [
                                    "Ancient India",
                                    "Medieval India",
                                    "Modern India",
                                ],
                            },
                            {
                                "name": "Indian Polity",
                                "topics": [
                                    "Constitution",
                                    "Union and State Government",
                                    "Judiciary",
                                ],
                            },
                            {
                                "name": "Indian Economy",
                                "topics": [
                                    "National Income",
                                    "Planning and Development",
                                    "Sectors of Economy",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Bihar GK",
                        "chapters": [
                            {
                                "name": "Bihar History",
                                "topics": [
                                    "Ancient Bihar",
                                    "Medieval Bihar",
                                    "Freedom Movement in Bihar",
                                ],
                            },
                            {
                                "name": "Bihar Geography",
                                "topics": [
                                    "Rivers of Bihar",
                                    "Physical Features",
                                    "Districts of Bihar",
                                ],
                            },
                            {
                                "name": "Bihar Economy",
                                "topics": [
                                    "Agriculture in Bihar",
                                    "Industries in Bihar",
                                    "State Budget",
                                ],
                            },
                            {
                                "name": "Bihar Culture",
                                "topics": [
                                    "Festivals of Bihar",
                                    "Art and Music",
                                    "Heritage Sites",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "History",
                        "chapters": [
                            {
                                "name": "Ancient India",
                                "topics": [
                                    "Indus Valley Civilization",
                                    "Vedic Period",
                                    "Maurya Empire",
                                    "Gupta Empire",
                                ],
                            },
                            {
                                "name": "Medieval India",
                                "topics": [
                                    "Delhi Sultanate",
                                    "Mughal Empire",
                                    "Bhakti Movement",
                                ],
                            },
                            {
                                "name": "Modern India",
                                "topics": [
                                    "British Rule",
                                    "Freedom Movement",
                                    "Post Independence",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Geography",
                        "chapters": [
                            {
                                "name": "Physical Geography",
                                "topics": [
                                    "Landforms",
                                    "Climate",
                                    "Oceanography",
                                ],
                            },
                            {
                                "name": "Indian Geography",
                                "topics": [
                                    "Physical Features",
                                    "Rivers and Mountains",
                                    "Climate",
                                ],
                            },
                            {
                                "name": "Bihar Geography",
                                "topics": [
                                    "Rivers of Bihar",
                                    "Physical Features",
                                    "Districts of Bihar",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Polity",
                        "chapters": [
                            {
                                "name": "Constitution",
                                "topics": [
                                    "Preamble",
                                    "Fundamental Rights and Duties",
                                    "Amendment Procedure",
                                ],
                            },
                            {
                                "name": "Panchayati Raj",
                                "topics": [
                                    "73rd Amendment",
                                    "Three Tier System",
                                    "Functions and Powers",
                                ],
                            },
                            {
                                "name": "Governance",
                                "topics": [
                                    "E-Governance",
                                    "Public Administration",
                                    "Accountability",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Economics",
                        "chapters": [
                            {
                                "name": "Indian Economy",
                                "topics": [
                                    "National Income",
                                    "Planning and Development",
                                    "Sectors of Economy",
                                ],
                            },
                            {
                                "name": "Bihar Economy",
                                "topics": [
                                    "Agriculture in Bihar",
                                    "Industries in Bihar",
                                    "State Budget",
                                ],
                            },
                            {
                                "name": "Budget",
                                "topics": [
                                    "Union Budget Basics",
                                    "Types of Deficit",
                                    "Budget Terms",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Current Affairs",
                        "chapters": [
                            {
                                "name": "National Affairs",
                                "topics": [
                                    "Government Policies",
                                    "National Appointments",
                                    "National Events",
                                ],
                            },
                            {
                                "name": "International Affairs",
                                "topics": [
                                    "International Organizations",
                                    "Global Summits",
                                    "Bilateral Relations",
                                ],
                            },
                            {
                                "name": "Bihar Current Affairs",
                                "topics": [
                                    "State Government Schemes",
                                    "Recent Appointments",
                                    "State Budget",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Bihar Police",
                "exam_type": "POLICE",
                "subjects": [
                    {
                        "name": "General Hindi",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Studies",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science and Mathematics",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mental Ability Test",
                        "chapters": [
                            {
                                "name": "Reasoning",
                                "topics": [
                                    "Verbal Reasoning",
                                    "Non-Verbal Reasoning",
                                    "Analytical Reasoning",
                                ],
                            },
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "BTSC",
                "exam_type": "STATE_GOVT",
                "subjects": [
                    {
                        "name": "General Studies",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Concerned Technical Subject",
                        "chapters": [
                            {
                                "name": "Core Technical Concepts",
                                "topics": [
                                    "Applied Technical Fundamentals",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Bihar SSC",
                "exam_type": "STATE_GOVT",
                "subjects": [
                    {
                        "name": "General Studies",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Algebra",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Polynomials",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mental Ability and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Bihar STET",
                "exam_type": "STATE_GOVT",
                "subjects": [
                    {
                        "name": "Child Development and Pedagogy",
                        "chapters": [
                            {
                                "name": "Learning Theory",
                                "topics": [
                                    "Behaviourism",
                                    "Cognitivism",
                                    "Constructivism",
                                ],
                            },
                            {
                                "name": "Teaching Methods",
                                "topics": [
                                    "Lecture Method",
                                    "Activity Based Learning",
                                    "Child Centred Approach",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Concerned Subject",
                        "chapters": [
                            {
                                "name": "Core Subject Content",
                                "topics": [
                                    "Core Syllabus Topics of the Discipline",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "UPPSC",
                "exam_type": "STATE_GOVT",
                "subjects": [
                    {
                        "name": "General Studies I",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Economics",
                                "topics": [
                                    "Micro Economics",
                                    "Macro Economics",
                                    "Indian Economy",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Studies II (CSAT)",
                        "chapters": [
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                            {
                                "name": "Logical Reasoning",
                                "topics": [
                                    "Statement and Conclusion",
                                    "Syllogism",
                                    "Assumptions",
                                ],
                            },
                            {
                                "name": "Basic Numeracy",
                                "topics": [
                                    "Number Systems",
                                    "Simplification",
                                    "Approximation",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Essay",
                        "chapters": [
                            {
                                "name": "Essay Writing",
                                "topics": [
                                    "Structure of an Essay",
                                    "Common Essay Topics",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "UPSSSC PET",
                "exam_type": "STATE_GOVT",
                "subjects": [
                    {
                        "name": "General Awareness",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Static GK",
                                "topics": [
                                    "National Symbols",
                                    "Important Days",
                                    "Books and Authors",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Hindi",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Elementary Arithmetic",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Percentage",
                                "topics": [
                                    "Basic Percentage",
                                    "Percentage Change",
                                    "Applications",
                                ],
                            },
                            {
                                "name": "Ratio",
                                "topics": [
                                    "Simple Ratio",
                                    "Compound Ratio",
                                    "Proportion",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Intelligence and Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Indian History",
                        "chapters": [
                            {
                                "name": "Ancient",
                                "topics": [
                                    "Indus Valley Civilization",
                                    "Vedic Period",
                                    "Mauryan Empire",
                                ],
                            },
                            {
                                "name": "Medieval",
                                "topics": [
                                    "Delhi Sultanate",
                                    "Mughal Empire",
                                    "Regional Kingdoms",
                                ],
                            },
                            {
                                "name": "Modern",
                                "topics": [
                                    "British Rule",
                                    "Freedom Struggle",
                                    "Post Independence India",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Indian National Movement",
                        "chapters": [
                            {
                                "name": "Freedom Movement",
                                "topics": [
                                    "Early Nationalism",
                                    "Gandhian Era",
                                    "Quit India Movement",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Geography, Environment and UP Region",
                        "chapters": [
                            {
                                "name": "UP Geography",
                                "topics": [
                                    "Rivers of UP",
                                    "Physical Features",
                                    "Districts",
                                ],
                            },
                            {
                                "name": "Environment",
                                "topics": [
                                    "Ecosystem",
                                    "Biodiversity",
                                    "Pollution and Conservation",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Indian Economy",
                        "chapters": [
                            {
                                "name": "Basic Economy Concepts",
                                "topics": [
                                    "National Income",
                                    "Inflation",
                                    "Fiscal Policy",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Indian Constitution and Public Administration",
                        "chapters": [
                            {
                                "name": "Constitution",
                                "topics": [
                                    "Preamble",
                                    "Fundamental Rights and Duties",
                                    "Amendment Procedure",
                                ],
                            },
                            {
                                "name": "Governance",
                                "topics": [
                                    "E-Governance",
                                    "Public Administration",
                                    "Accountability",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "UP Police",
                "exam_type": "POLICE",
                "subjects": [
                    {
                        "name": "General Hindi",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Knowledge and Current Affairs",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Numerical and Mental Ability",
                        "chapters": [
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                            {
                                "name": "Data Interpretation",
                                "topics": [
                                    "Tables",
                                    "Bar Graphs",
                                    "Pie Charts",
                                    "Line Graphs",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mental Aptitude / IQ / Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "RPSC",
                "exam_type": "STATE_GOVT",
                "subjects": [
                    {
                        "name": "General Knowledge",
                        "chapters": [
                            {
                                "name": "Rajasthan GK",
                                "topics": [
                                    "State Symbols",
                                    "Important Places",
                                    "Districts",
                                ],
                            },
                            {
                                "name": "Indian GK",
                                "topics": [
                                    "National Symbols",
                                    "States and Capitals",
                                    "Important Days",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "History, Art and Culture of Rajasthan",
                        "chapters": [
                            {
                                "name": "Rajasthan History",
                                "topics": [
                                    "Ancient Rajasthan",
                                    "Medieval Rajputana",
                                    "Freedom Movement in Rajasthan",
                                ],
                            },
                            {
                                "name": "Rajasthan Culture",
                                "topics": [
                                    "Festivals",
                                    "Traditions",
                                    "Folk Culture",
                                ],
                            },
                            {
                                "name": "Rajasthan Art",
                                "topics": [
                                    "Paintings and Handicrafts",
                                    "Folk Dance and Music",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General English and Hindi",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "REET",
                "exam_type": "STATE_GOVT",
                "subjects": [
                    {
                        "name": "Child Development and Pedagogy",
                        "chapters": [
                            {
                                "name": "Learning Theory",
                                "topics": [
                                    "Behaviourism",
                                    "Cognitivism",
                                    "Constructivism",
                                ],
                            },
                            {
                                "name": "Child Psychology",
                                "topics": [
                                    "Cognitive Development",
                                    "Emotional Development",
                                    "Behaviourism",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language I (Hindi)",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Language II (English)",
                        "chapters": [
                            {
                                "name": "Grammar",
                                "topics": [
                                    "Parts of Speech",
                                    "Tenses",
                                    "Sentence Structure",
                                ],
                            },
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Mathematics",
                        "chapters": [
                            {
                                "name": "Number System",
                                "topics": [
                                    "Natural and Whole Numbers",
                                    "Divisibility Rules",
                                    "HCF and LCM",
                                ],
                            },
                            {
                                "name": "Geometry",
                                "topics": [
                                    "Lines and Angles",
                                    "Triangles",
                                    "Circles",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Environmental Studies",
                        "chapters": [
                            {
                                "name": "Science Basics",
                                "topics": [
                                    "Living and Non-Living Things",
                                    "Basic Scientific Concepts",
                                ],
                            },
                            {
                                "name": "Social Studies Basics",
                                "topics": [
                                    "History Basics",
                                    "Geography Basics",
                                    "Civics Basics",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "Rajasthan Police",
                "exam_type": "POLICE",
                "subjects": [
                    {
                        "name": "Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Knowledge and Current Affairs",
                        "chapters": [
                            {
                                "name": "National Affairs",
                                "topics": [
                                    "Government Policies",
                                    "National Appointments",
                                    "National Events",
                                ],
                            },
                            {
                                "name": "Rajasthan Current Affairs",
                                "topics": [
                                    "State Schemes",
                                    "Recent Appointments",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Rajasthan GK",
                        "chapters": [
                            {
                                "name": "Rajasthan History",
                                "topics": [
                                    "Ancient Rajasthan",
                                    "Medieval Rajputana",
                                    "Freedom Movement in Rajasthan",
                                ],
                            },
                            {
                                "name": "Rajasthan Geography",
                                "topics": [
                                    "Physical Features",
                                    "Rivers",
                                    "Desert Region",
                                ],
                            },
                            {
                                "name": "Rajasthan Culture",
                                "topics": [
                                    "Festivals",
                                    "Traditions",
                                    "Folk Culture",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "MPPSC",
                "exam_type": "STATE_GOVT",
                "subjects": [
                    {
                        "name": "General Studies",
                        "chapters": [
                            {
                                "name": "History",
                                "topics": [
                                    "Ancient History",
                                    "Medieval History",
                                    "Modern History",
                                ],
                            },
                            {
                                "name": "Geography",
                                "topics": [
                                    "Physical Geography",
                                    "Indian Geography",
                                    "World Geography",
                                ],
                            },
                            {
                                "name": "Polity",
                                "topics": [
                                    "Constitution",
                                    "Fundamental Rights",
                                    "Governance Structure",
                                ],
                            },
                            {
                                "name": "Economics",
                                "topics": [
                                    "Micro Economics",
                                    "Macro Economics",
                                    "Indian Economy",
                                ],
                            },
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Aptitude (CSAT)",
                        "chapters": [
                            {
                                "name": "Comprehension",
                                "topics": [
                                    "Passage Based Questions",
                                    "Inference and Tone",
                                ],
                            },
                            {
                                "name": "Logical Reasoning",
                                "topics": [
                                    "Statement and Conclusion",
                                    "Syllogism",
                                    "Assumptions",
                                ],
                            },
                            {
                                "name": "Basic Numeracy",
                                "topics": [
                                    "Number Systems",
                                    "Simplification",
                                    "Approximation",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Madhya Pradesh GK",
                        "chapters": [
                            {
                                "name": "MP History",
                                "topics": [
                                    "Ancient MP",
                                    "Medieval MP",
                                    "Freedom Movement in MP",
                                ],
                            },
                            {
                                "name": "MP Geography",
                                "topics": [
                                    "Rivers of MP",
                                    "Physical Features",
                                ],
                            },
                            {
                                "name": "MP Economy",
                                "topics": [
                                    "Agriculture in MP",
                                    "Industries in MP",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "MP Police",
                "exam_type": "POLICE",
                "subjects": [
                    {
                        "name": "General Knowledge and Current Affairs",
                        "chapters": [
                            {
                                "name": "National Affairs",
                                "topics": [
                                    "Government Policies",
                                    "National Appointments",
                                    "National Events",
                                ],
                            },
                            {
                                "name": "MP Current Affairs",
                                "topics": [
                                    "State Schemes",
                                    "Recent Appointments",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Reasoning",
                        "chapters": [
                            {
                                "name": "Analogy",
                                "topics": [
                                    "Word Analogy",
                                    "Number Analogy",
                                    "Figure Analogy",
                                ],
                            },
                            {
                                "name": "Series",
                                "topics": [
                                    "Number Series",
                                    "Alphabet Series",
                                    "Mixed Series",
                                ],
                            },
                            {
                                "name": "Coding Decoding",
                                "topics": [
                                    "Letter Coding",
                                    "Number Coding",
                                    "Symbol Coding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Intelligence Test",
                        "chapters": [
                            {
                                "name": "Verbal Reasoning",
                                "topics": [
                                    "Analogy",
                                    "Classification",
                                    "Coding Decoding",
                                ],
                            },
                            {
                                "name": "Non-Verbal Reasoning",
                                "topics": [
                                    "Series",
                                    "Mirror Images",
                                    "Paper Folding",
                                ],
                            },
                            {
                                "name": "Blood Relation",
                                "topics": [
                                    "Family Tree",
                                    "Relation Based Questions",
                                ],
                            },
                            {
                                "name": "Classification",
                                "topics": [
                                    "Odd One Out",
                                    "Word Classification",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "General Science and Simple Arithmetic",
                        "chapters": [
                            {
                                "name": "Physics",
                                "topics": [
                                    "Mechanics",
                                    "Electricity and Magnetism",
                                    "Modern Physics",
                                ],
                            },
                            {
                                "name": "Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Bonding",
                                    "Periodic Table",
                                ],
                            },
                            {
                                "name": "Biology",
                                "topics": [
                                    "Cell Biology",
                                    "Human Physiology",
                                    "Genetics",
                                ],
                            },
                            {
                                "name": "Arithmetic",
                                "topics": [
                                    "Percentage",
                                    "Profit and Loss",
                                    "Simple and Compound Interest",
                                    "Ratio and Proportion",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "Engineering",
        "exams": [
            {
                "name": "GATE",
                "exam_type": "ENGINEERING",
                "subjects": [
                    {
                        "name": "Engineering Mathematics",
                        "chapters": [
                            {
                                "name": "Linear Algebra",
                                "topics": [
                                    "Matrices",
                                    "Determinants",
                                    "Eigenvalues and Eigenvectors",
                                ],
                            },
                            {
                                "name": "Calculus",
                                "topics": [
                                    "Limits",
                                    "Differentiation",
                                    "Integration",
                                ],
                            },
                            {
                                "name": "Differential Equations",
                                "topics": [
                                    "First Order Equations",
                                    "Second Order Equations",
                                    "Applications",
                                ],
                            },
                            {
                                "name": "Probability and Statistics",
                                "topics": [
                                    "Probability Distributions",
                                    "Mean and Variance",
                                    "Hypothesis Testing",
                                ],
                            },
                            {
                                "name": "Complex Variables",
                                "topics": [
                                    "Complex Numbers",
                                    "Analytic Functions",
                                    "Contour Integration",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Core Engineering Subjects",
                        "chapters": [
                            {
                                "name": "Discipline Specific Core Topics",
                                "topics": [
                                    "Core Subject Fundamentals of Chosen Engineering Discipline",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Aptitude",
                        "chapters": [
                            {
                                "name": "Verbal Ability",
                                "topics": [
                                    "Grammar",
                                    "Vocabulary",
                                    "Comprehension",
                                ],
                            },
                            {
                                "name": "Numerical Ability",
                                "topics": [
                                    "Simplification",
                                    "Number Series",
                                    "Data Interpretation",
                                ],
                            },
                            {
                                "name": "Analytical Reasoning",
                                "topics": [
                                    "Statement and Argument",
                                    "Course of Action",
                                    "Syllogism",
                                ],
                            },
                            {
                                "name": "Spatial Reasoning",
                                "topics": [
                                    "Figure Formation",
                                    "Rotation of Figures",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "ESE",
                "exam_type": "ENGINEERING",
                "subjects": [
                    {
                        "name": "General Studies and Engineering Aptitude",
                        "chapters": [
                            {
                                "name": "Current Affairs",
                                "topics": [
                                    "National Affairs",
                                    "International Affairs",
                                    "Sports and Awards",
                                ],
                            },
                            {
                                "name": "Engineering Ethics",
                                "topics": [
                                    "Professional Responsibility",
                                    "Codes of Conduct",
                                    "Case Studies",
                                ],
                            },
                            {
                                "name": "Environmental Impact",
                                "topics": [
                                    "Environmental Impact Assessment",
                                    "Sustainable Development",
                                ],
                            },
                            {
                                "name": "Basics of Project Management",
                                "topics": [
                                    "Project Life Cycle",
                                    "Risk Management",
                                    "Scheduling",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Engineering Discipline Paper I",
                        "chapters": [
                            {
                                "name": "Core Subject Fundamentals",
                                "topics": [
                                    "Foundational Concepts of the Discipline",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Engineering Discipline Paper II",
                        "chapters": [
                            {
                                "name": "Advanced Core Subject Topics",
                                "topics": [
                                    "Discipline Specific Advanced Concepts",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "Medical",
        "exams": [
            {
                "name": "NEET",
                "exam_type": "MEDICAL",
                "subjects": [
                    {
                        "name": "Physics",
                        "chapters": [
                            {
                                "name": "Mechanics",
                                "topics": [
                                    "Laws of Motion",
                                    "Work Energy Power",
                                    "Rotational Motion",
                                ],
                            },
                            {
                                "name": "Optics",
                                "topics": [
                                    "Reflection",
                                    "Refraction",
                                    "Lenses and Mirrors",
                                ],
                            },
                            {
                                "name": "Electricity",
                                "topics": [
                                    "Current Electricity",
                                    "Ohm's Law",
                                    "Electromagnetism",
                                ],
                            },
                            {
                                "name": "Thermodynamics",
                                "topics": [
                                    "Laws of Thermodynamics",
                                    "Heat Transfer",
                                    "Kinetic Theory of Gases",
                                ],
                            },
                            {
                                "name": "Modern Physics",
                                "topics": [
                                    "Dual Nature of Matter",
                                    "Atoms and Nuclei",
                                    "Semiconductor Electronics",
                                ],
                            },
                            {
                                "name": "Waves and Oscillations",
                                "topics": [
                                    "Simple Harmonic Motion",
                                    "Wave Motion",
                                    "Sound Waves",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Chemistry",
                        "chapters": [
                            {
                                "name": "Organic Chemistry",
                                "topics": [
                                    "Hydrocarbons",
                                    "Functional Groups",
                                    "Reaction Mechanisms",
                                ],
                            },
                            {
                                "name": "Physical Chemistry",
                                "topics": [
                                    "Atomic Structure",
                                    "Chemical Kinetics",
                                    "Thermodynamics",
                                ],
                            },
                            {
                                "name": "Inorganic Chemistry",
                                "topics": [
                                    "Periodic Table and Periodicity",
                                    "Chemical Bonding",
                                    "Coordination Compounds",
                                    "p-Block and d-Block Elements",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Biology",
                        "chapters": [
                            {
                                "name": "Botany",
                                "topics": [
                                    "Plant Physiology",
                                    "Plant Morphology",
                                    "Plant Diversity",
                                ],
                            },
                            {
                                "name": "Zoology",
                                "topics": [
                                    "Animal Physiology",
                                    "Animal Classification",
                                    "Animal Diversity",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    {
        "category": "Chartered Accountancy",
        "exams": [
            {
                "name": "CA Foundation",
                "exam_type": "CA",
                "subjects": [
                    {
                        "name": "Accounting",
                        "chapters": [
                            {
                                "name": "Theoretical Framework",
                                "topics": [
                                    "Accounting Concepts",
                                    "Accounting Principles",
                                    "Accounting Standards Overview",
                                ],
                            },
                            {
                                "name": "Accounting Process",
                                "topics": [
                                    "Journal Entries",
                                    "Ledger Posting",
                                    "Trial Balance",
                                ],
                            },
                            {
                                "name": "Bank Reconciliation Statement",
                                "topics": [
                                    "Causes of Difference",
                                    "Preparation Method",
                                    "Adjusting Entries",
                                ],
                            },
                            {
                                "name": "Inventories",
                                "topics": [
                                    "Valuation Methods",
                                    "FIFO and LIFO",
                                    "Inventory Systems",
                                ],
                            },
                            {
                                "name": "Depreciation Accounting",
                                "topics": [
                                    "Straight Line Method",
                                    "Written Down Value Method",
                                    "Change in Method",
                                ],
                            },
                            {
                                "name": "Bills of Exchange and Promissory Notes",
                                "topics": [
                                    "Definition and Features",
                                    "Discounting",
                                    "Dishonour of Bill",
                                ],
                            },
                            {
                                "name": "Final Accounts of Sole Proprietors",
                                "topics": [
                                    "Trading Account",
                                    "Profit and Loss Account",
                                    "Balance Sheet",
                                ],
                            },
                            {
                                "name": "Partnership Accounts",
                                "topics": [
                                    "Profit Sharing",
                                    "Admission of Partner",
                                    "Retirement and Death of Partner",
                                ],
                            },
                            {
                                "name": "Introduction to Company Accounts",
                                "topics": [
                                    "Types of Share Capital",
                                    "Issue of Shares",
                                    "Basic Company Accounting",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Business Laws",
                        "chapters": [
                            {
                                "name": "Indian Regulatory Framework",
                                "topics": [
                                    "Business Laws Overview",
                                    "Regulatory Bodies",
                                ],
                            },
                            {
                                "name": "Indian Contract Act 1872",
                                "topics": [
                                    "Essentials of a Valid Contract",
                                    "Offer and Acceptance",
                                    "Breach of Contract",
                                ],
                            },
                            {
                                "name": "Sale of Goods Act 1930",
                                "topics": [
                                    "Conditions and Warranties",
                                    "Transfer of Ownership",
                                    "Rights of Unpaid Seller",
                                ],
                            },
                            {
                                "name": "Indian Partnership Act 1932",
                                "topics": [
                                    "Definition and Nature",
                                    "Rights and Duties of Partners",
                                    "Dissolution",
                                ],
                            },
                            {
                                "name": "Limited Liability Partnership Act 2008",
                                "topics": [
                                    "Formation of LLP",
                                    "Partners' Rights",
                                    "Winding Up",
                                ],
                            },
                            {
                                "name": "Companies Act 2013",
                                "topics": [
                                    "Incorporation of Company",
                                    "Directors and Board",
                                    "Meetings and Resolutions",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Quantitative Aptitude",
                        "chapters": [
                            {
                                "name": "Ratio and Proportion, Indices and Logarithms",
                                "topics": [
                                    "Ratio and Proportion",
                                    "Laws of Indices",
                                    "Logarithms",
                                ],
                            },
                            {
                                "name": "Equations and Linear Inequalities",
                                "topics": [
                                    "Linear Equations",
                                    "Quadratic Equations",
                                    "Inequalities",
                                ],
                            },
                            {
                                "name": "Time Value of Money",
                                "topics": [
                                    "Present Value",
                                    "Future Value",
                                    "Annuities",
                                ],
                            },
                            {
                                "name": "Permutations and Combinations",
                                "topics": [
                                    "Fundamental Counting Principle",
                                    "Permutations",
                                    "Combinations",
                                ],
                            },
                            {
                                "name": "Sequence and Series",
                                "topics": [
                                    "Arithmetic Progression",
                                    "Geometric Progression",
                                    "Series Sum",
                                ],
                            },
                            {
                                "name": "Sets, Relations and Functions",
                                "topics": [
                                    "Set Theory",
                                    "Relations",
                                    "Functions",
                                ],
                            },
                            {
                                "name": "Basic Differential and Integral Calculus",
                                "topics": [
                                    "Limits and Continuity",
                                    "Differentiation",
                                    "Integration",
                                ],
                            },
                            {
                                "name": "Statistical Description of Data",
                                "topics": [
                                    "Tabulation",
                                    "Frequency Distribution",
                                    "Graphical Representation",
                                ],
                            },
                            {
                                "name": "Measures of Central Tendency and Dispersion",
                                "topics": [
                                    "Mean Median Mode",
                                    "Standard Deviation",
                                    "Variance",
                                ],
                            },
                            {
                                "name": "Probability",
                                "topics": [
                                    "Basic Probability",
                                    "Conditional Probability",
                                    "Bayes Theorem",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Business Economics",
                        "chapters": [
                            {
                                "name": "Nature and Scope of Business Economics",
                                "topics": [
                                    "Definition and Scope",
                                    "Relation with Other Disciplines",
                                ],
                            },
                            {
                                "name": "Theory of Demand and Supply",
                                "topics": [
                                    "Law of Demand",
                                    "Law of Supply",
                                    "Market Equilibrium",
                                ],
                            },
                            {
                                "name": "Theory of Production and Cost",
                                "topics": [
                                    "Production Function",
                                    "Cost Curves",
                                    "Returns to Scale",
                                ],
                            },
                            {
                                "name": "Price Determination in Different Markets",
                                "topics": [
                                    "Perfect Competition",
                                    "Monopoly",
                                    "Oligopoly",
                                ],
                            },
                            {
                                "name": "Business Cycles",
                                "topics": [
                                    "Phases of Business Cycle",
                                    "Causes",
                                    "Government Response",
                                ],
                            },
                            {
                                "name": "Indian Economy Basics",
                                "topics": [
                                    "Sectors of Economy",
                                    "National Income Concepts",
                                    "Economic Planning",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "CA Intermediate",
                "exam_type": "CA",
                "subjects": [
                    {
                        "name": "Advanced Accounting",
                        "chapters": [
                            {
                                "name": "Accounting Standards",
                                "topics": [
                                    "Ind AS Overview",
                                    "AS vs Ind AS",
                                    "Disclosure Requirements",
                                ],
                            },
                            {
                                "name": "Company Accounts",
                                "topics": [
                                    "Share Capital",
                                    "Issue of Shares",
                                    "Redemption of Debentures",
                                ],
                            },
                            {
                                "name": "Partnership and LLP Accounts",
                                "topics": [
                                    "Partnership Deed Provisions",
                                    "LLP Accounting",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Corporate and Other Laws",
                        "chapters": [
                            {
                                "name": "Companies Act 2013",
                                "topics": [
                                    "Incorporation of Company",
                                    "Directors and Board",
                                    "Meetings and Resolutions",
                                ],
                            },
                            {
                                "name": "General Clauses Act",
                                "topics": [
                                    "Interpretation of Statutes",
                                    "General Definitions",
                                ],
                            },
                            {
                                "name": "Negotiable Instruments Act",
                                "topics": [
                                    "Promissory Note",
                                    "Bill of Exchange",
                                    "Cheque",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Taxation",
                        "chapters": [
                            {
                                "name": "Income Tax Law",
                                "topics": [
                                    "Heads of Income",
                                    "Deductions",
                                    "Tax Slabs",
                                ],
                            },
                            {
                                "name": "Goods and Services Tax (GST)",
                                "topics": [
                                    "GST Structure",
                                    "Input Tax Credit",
                                    "Returns Filing",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Cost and Management Accounting",
                        "chapters": [
                            {
                                "name": "Cost Ascertainment",
                                "topics": [
                                    "Material Costing",
                                    "Labour Costing",
                                    "Overheads",
                                ],
                            },
                            {
                                "name": "Cost Accounting Techniques",
                                "topics": [
                                    "Marginal Costing",
                                    "Standard Costing",
                                    "Budgetary Control",
                                ],
                            },
                            {
                                "name": "Standard Costing",
                                "topics": [
                                    "Variance Analysis",
                                    "Material and Labour Variance",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Auditing and Ethics",
                        "chapters": [
                            {
                                "name": "Auditing Concepts",
                                "topics": [
                                    "Types of Audit",
                                    "Audit Planning",
                                    "Internal Control",
                                ],
                            },
                            {
                                "name": "Audit Documentation",
                                "topics": [
                                    "Working Papers",
                                    "Audit Evidence",
                                    "Audit Trail",
                                ],
                            },
                            {
                                "name": "Company Audit",
                                "topics": [
                                    "Appointment of Auditor",
                                    "Auditor's Report",
                                    "Auditor's Liability",
                                ],
                            },
                            {
                                "name": "Professional Ethics",
                                "topics": [
                                    "Code of Conduct",
                                    "Independence of Auditor",
                                    "Disciplinary Mechanism",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Financial Management and Strategic Management",
                        "chapters": [
                            {
                                "name": "Financial Management Basics",
                                "topics": [
                                    "Objectives of Financial Management",
                                    "Time Value of Money",
                                    "Sources of Finance",
                                ],
                            },
                            {
                                "name": "Capital Budgeting",
                                "topics": [
                                    "NPV Method",
                                    "IRR Method",
                                    "Payback Period",
                                ],
                            },
                            {
                                "name": "Working Capital Management",
                                "topics": [
                                    "Cash Management",
                                    "Inventory Management",
                                    "Receivables Management",
                                ],
                            },
                            {
                                "name": "Strategic Management Concepts",
                                "topics": [
                                    "SWOT Analysis",
                                    "Business Strategy Levels",
                                    "Strategic Planning",
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                "name": "CA Final",
                "exam_type": "CA",
                "subjects": [
                    {
                        "name": "Financial Reporting",
                        "chapters": [
                            {
                                "name": "Ind AS Framework",
                                "topics": [
                                    "Conceptual Framework",
                                    "First Time Adoption",
                                    "Presentation of Financial Statements",
                                ],
                            },
                            {
                                "name": "Business Combinations",
                                "topics": [
                                    "Mergers and Acquisitions",
                                    "Goodwill Computation",
                                    "Consolidation Methods",
                                ],
                            },
                            {
                                "name": "Consolidated Financial Statements",
                                "topics": [
                                    "Parent-Subsidiary Accounting",
                                    "Minority Interest",
                                    "Elimination Entries",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Advanced Financial Management",
                        "chapters": [
                            {
                                "name": "Security Valuation",
                                "topics": [
                                    "Bond Valuation",
                                    "Equity Valuation",
                                    "Valuation Models",
                                ],
                            },
                            {
                                "name": "Portfolio Management",
                                "topics": [
                                    "Risk and Return",
                                    "Diversification",
                                    "CAPM",
                                ],
                            },
                            {
                                "name": "Derivatives",
                                "topics": [
                                    "Futures and Forwards",
                                    "Options",
                                    "Swaps",
                                ],
                            },
                            {
                                "name": "International Financial Management",
                                "topics": [
                                    "Foreign Exchange Management",
                                    "International Capital Budgeting",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Advanced Auditing and Professional Ethics",
                        "chapters": [
                            {
                                "name": "Audit of Special Entities",
                                "topics": [
                                    "Bank Audit",
                                    "Insurance Audit",
                                    "NBFC Audit",
                                ],
                            },
                            {
                                "name": "Professional Ethics",
                                "topics": [
                                    "Code of Conduct",
                                    "Independence of Auditor",
                                    "Disciplinary Mechanism",
                                ],
                            },
                            {
                                "name": "Standards on Auditing",
                                "topics": [
                                    "SA 200 Series",
                                    "SA 500 Series",
                                    "SA 700 Series",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Direct Tax Laws and International Taxation",
                        "chapters": [
                            {
                                "name": "Corporate Tax Planning",
                                "topics": [
                                    "Tax Planning vs Avoidance",
                                    "MAT and AMT",
                                    "Deductions for Companies",
                                ],
                            },
                            {
                                "name": "International Taxation",
                                "topics": [
                                    "Double Taxation Avoidance",
                                    "Transfer Pricing Basics",
                                ],
                            },
                            {
                                "name": "Transfer Pricing",
                                "topics": [
                                    "Arm's Length Price",
                                    "Methods of Transfer Pricing",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Indirect Tax Laws",
                        "chapters": [
                            {
                                "name": "GST Advanced Provisions",
                                "topics": [
                                    "Input Tax Credit",
                                    "GST Returns",
                                    "Reverse Charge Mechanism",
                                ],
                            },
                            {
                                "name": "Customs Law",
                                "topics": [
                                    "Import Export Procedures",
                                    "Customs Duty",
                                    "Valuation Rules",
                                ],
                            },
                            {
                                "name": "Foreign Trade Policy",
                                "topics": [
                                    "Export Promotion Schemes",
                                    "SEZ",
                                    "EXIM Policy",
                                ],
                            },
                        ],
                    },
                    {
                        "name": "Integrated Business Solutions",
                        "chapters": [
                            {
                                "name": "Multidisciplinary Case Studies",
                                "topics": [
                                    "Integrated Business Scenarios",
                                    "Cross-Functional Problem Solving",
                                ],
                            },
                        ],
                    },
                ],
            },
        ],
    },
]
