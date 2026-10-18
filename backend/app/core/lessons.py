LEVELS = ["L1", "L2", "L3"]

LESSONS = [
    # Level 1 - Beginner (Colors, Animals, Numbers, Alphabet, Everyday Objects)
    {
        "id": "l1_colors_sky",
        "level": "L1",
        "topic": "colors",
        "question": "What color is the sky on a sunny day?",
        "options": ["Blue", "Green", "Red"],
        "accepted": ["blue", "the sky is blue", "it is blue", "it's blue"],
        "hint": "Look up on a bright day without clouds!",
        "explanation": "The sky looks blue because of the sunlight in the air.",
        "feedback": "Super job! The sky is bright blue! 🌤️"
    },
    {
        "id": "l1_animal_cat",
        "level": "L1",
        "topic": "animals",
        "question": "What sound does a cat make?",
        "options": ["Meow", "Woof", "Moo"],
        "accepted": ["meow", "mew", "a cat says meow"],
        "hint": "It rhymes with cow!",
        "explanation": "Cats make a soft meow sound when they want to say hello.",
        "feedback": "Meow! You got it right! Good kitten! 🐱"
    },
    {
        "id": "l1_alphabet_apple",
        "level": "L1",
        "topic": "alphabet",
        "question": "Which letter does the word 'Apple' start with?",
        "options": ["A", "B", "C"],
        "accepted": ["a", "letter a", "letter 'a'"],
        "hint": "It is the very first letter of the alphabet!",
        "explanation": "'A' is for Apple, alligator, and astronaut.",
        "feedback": "Awesome! 'A' is for Apple! 🍎"
    },
    {
        "id": "l1_number_count",
        "level": "L1",
        "topic": "numbers",
        "question": "How many fingers do you have on one hand?",
        "options": ["5", "4", "10"],
        "accepted": ["5", "five", "five fingers"],
        "hint": "Count them: 1, 2, 3, 4...",
        "explanation": "Each hand has five fingers: thumb, index, middle, ring, and pinky.",
        "feedback": "High five! You have five fingers! ✋"
    },
    {
        "id": "l1_objects_sun",
        "level": "L1",
        "topic": "nature",
        "question": "What gives us light and warmth during the day?",
        "options": ["Sun", "Moon", "Lamp"],
        "accepted": ["sun", "the sun"],
        "hint": "It is a giant bright yellow star in the sky.",
        "explanation": "The sun shines during the day and keeps our earth warm.",
        "feedback": "Spot on! The sun shines so warm and bright! ☀️"
    },

    # Level 2 - Elementary (Basic sentences, common verbs, everyday questions, simple grammar)
    {
        "id": "l2_sentence_like",
        "level": "L2",
        "topic": "sentences",
        "question": "Complete the friendly sentence: 'I like to eat sweet red ____.'",
        "options": ["apples", "rocks", "shoes"],
        "accepted": ["apples", "apple", "strawberries", "cherries"],
        "hint": "Think of a yummy fruit you can munch on.",
        "explanation": "'I like to eat...' is a great way to tell someone your favorite food.",
        "feedback": "Yum! Apples are sweet and crunchy! 🍎"
    },
    {
        "id": "l2_verb_birds",
        "level": "L2",
        "topic": "verbs",
        "question": "What do birds do in the sky with their wings?",
        "options": ["Fly", "Swim", "Drive"],
        "accepted": ["fly", "they fly", "flying"],
        "hint": "Fish swim, people walk, and birds...",
        "explanation": "Birds use their feathers and wings to fly high in the air.",
        "feedback": "Terrific! Birds fly high in the sky! 🕊️"
    },
    {
        "id": "l2_question_where",
        "level": "L2",
        "topic": "questions",
        "question": "Where does a friendly bear sleep in winter?",
        "options": ["In a cave", "In a school", "In an airplane"],
        "accepted": ["cave", "in a cave", "a cave", "den", "in a den"],
        "hint": "It is a cozy, rocky shelter in the mountain.",
        "explanation": "Bears take long winter naps in quiet caves or dens.",
        "feedback": "Cozy answer! Bears sleep peacefully in a cave! 🐻"
    },
    {
        "id": "l2_grammar_plural",
        "level": "L2",
        "topic": "grammar",
        "question": "One cat, two ____. (What is the plural of cat?)",
        "options": ["Cats", "Cat", "Cates"],
        "accepted": ["cats", "two cats"],
        "hint": "Add the letter 's' to the end of the word.",
        "explanation": "When there is more than one, we usually add 's': cat -> cats.",
        "feedback": "Brilliant! One cat, two cats! 🐾"
    },

    # Level 3 - Early Conversational (Simple storytelling, descriptive sentences, comprehension)
    {
        "id": "l3_story_simple",
        "level": "L3",
        "topic": "storytelling",
        "question": "Tell a short story or sentence about a happy dog. What did the dog do?",
        "options": ["The dog wagged its tail and ran.", "The dog jumped in the river.", "The dog barked happily."],
        "accepted": ["dog", "happy", "wag", "bark", "ran", "jumped", "played", "tail"],
        "hint": "Mention the dog and what fun thing it did!",
        "explanation": "Stories describe who was there and what actions they took.",
        "feedback": "What a delightful story! That sounds like such a joyful puppy! 🐕"
    },
    {
        "id": "l3_comprehension_seasons",
        "level": "L3",
        "topic": "comprehension",
        "question": "In autumn, green leaves turn yellow and red, and then they fall from the trees. What do the leaves do?",
        "options": ["Fall from the trees", "Swim away", "Turn blue"],
        "accepted": ["fall", "they fall", "fall from the trees", "drop", "change color"],
        "hint": "They gently drop down to the soft ground.",
        "explanation": "Leaves change colors and fall off trees during autumn/fall.",
        "feedback": "Wonderful comprehension! The leaves fall down like confetti! 🍂"
    },
    {
        "id": "l3_descriptive_feelings",
        "level": "L3",
        "topic": "conversation",
        "question": "If your friend shares a toy with you, how would you say thank you?",
        "options": ["Thank you for sharing!", "Give me that!", "No thank you."],
        "accepted": ["thank you", "thanks", "thank you for sharing", "thank you friend"],
        "hint": "Use the polite magic words 'Thank you'.",
        "explanation": "Saying 'Thank you' makes people feel happy and appreciated.",
        "feedback": "So kind and polite! Saying thank you spreads joy! 💖"
    }
]


def lessons_for_level(level: str):
    return [l for l in LESSONS if l["level"] == level]


def get_lesson(lesson_id: str):
    for l in LESSONS:
        if l["id"] == lesson_id:
            return l
    return None
