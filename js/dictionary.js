const LumiDictionary = {
  // 1. الدعم النفسي والتشجيع (أولوية 1)
  psychology: [
    { id: "welcome", priority: 1, category: "ترحيب", eg: "أهلاً يا أجمل بنوتة في الدنيا! يلا نلعب ونتعلم سوا!", fr: "Bonjour ma chérie ! On joue ensemble ?" },
    { id: "praise_1", priority: 1, category: "تشجيع النجاح", eg: "برافو عليكي يا بطلة! شطورة خالص!", fr: "Bravo ma championne ! C'est parfait !" },
    { id: "praise_2", priority: 1, category: "تشجيع النجاح", eg: "إيه الذكاء والحلاوة دي! فخور بيكي جداً!", fr: "Tu es très intelligente ! Magnifique !" },
    { id: "praise_3", priority: 1, category: "تشجيع النجاح", eg: "هايل يا حبيبتي! إجابة صح مية في المية!", fr: "Super mon cœur ! Bonne réponse !" },
    { id: "comfort_1", priority: 1, category: "تطمين عند الخطأ", eg: "ولا يهمك يا حبيبتي، كلنا بنغلط عشان نتعلم، جربي تاني!", fr: "Ce n'est pas grave, essaie encore !" },
    { id: "comfort_2", priority: 1, category: "تطمين عند الخطأ", eg: "قربتي خالص يا بطلة! ركزي شوية وهتجيبيها صح!", fr: "Tu es tout près ! Concentre-toi un peu !" },
    { id: "comfort_3", priority: 1, category: "تطمين عند الخطأ", eg: "مفيش مشكلة أبداً، أنا واثق فيكي يلا نحاول مرة كمان!", fr: "Pas de souci, j'ai confiance en toi !" },
    { id: "hint_shield", priority: 1, category: "درع التلميح", eg: "بصي كويس على الحاجة اللي بتنور دي، هي هتساعدك!", fr: "Regarde bien ce qui brille, ça va t'aider !" },
    { id: "level_up", priority: 1, category: "اجتياز مستوى", eg: "يا سلام! خلصتي المستوى ده وكسبتي ملصق جديد في ألبومك!", fr: "Hourra ! Niveau réussi, voici un nouvel autocollant !" },
    { id: "mic_prompt", priority: 1, category: "تشجيع النطق", eg: "دوسي على المايك وقولي الكلمة بالفرنساوي بصوتك الجميل!", fr: "Appuie sur le micro et répète le mot !" },
    { id: "mic_success", priority: 1, category: "نجاح النطق", eg: "نطقك يجنن! كأنك بتتكلمي فرنساوي بجد!", fr: "Quelle belle prononciation ! Bravo !" },
    { id: "sleep_warning", priority: 1, category: "تنبيه الراحة", eg: "فاضل لعبة واحدة بس ونقفل عشان عيوننا الحلوة ترتاح يا بطلة.", fr: "Plus qu'un jeu et on repose nos beaux yeux." },
    { id: "sleep_now", priority: 1, category: "وقت النوم", eg: "تصبحى على خير يا حبيبتي، لعبنا كتير النهاردة وبكرة نكمل!", fr: "Bonne nuit ma puce, à demain !" },
    { id: "coop_win", priority: 1, category: "لعب تعاوني", eg: "كسبتيني يا شقية! لعبك سريع وذكي أوي!", fr: "Tu m'as gagné ! Tu es trop rapide !" }
  ],

  // 2. توجيهات الألعاب الصوتية (تنطق تلقائياً عند دخول كل لعبة)
  gameInstructions: [
    { id: "inst_memory", gameId: "memory", eg: "اقلبي الكروت وطلعي كل صورتين شبه بعض!", fr: "Retourne les cartes et trouve les paires !" },
    { id: "inst_shadows", gameId: "shadows", eg: "بصي على الصورة اللي فوق واختاري الظل بتاعها!", fr: "Trouve la bonne ombre !" },
    { id: "inst_numbers", gameId: "numbers", eg: "شوفي الرقم المكتوب وأكّلي الأرنب نفس العدد من الجزر!", fr: "Donne le bon nombre de carottes au lapin !" },
    { id: "inst_coloring", gameId: "coloring", eg: "اختاري اللون اللي بتحبيه ولمسي الرسمة عشان تلونيها!", fr: "Choisis une couleur et dessine !" },
    { id: "inst_alphabet", gameId: "alphabet", eg: "اسمعي صوت الحرف الفرنساوي واختاري الكارت الصح!", fr: "Écoute la lettre et choisis la bonne carte !" },
    { id: "inst_dictionary", gameId: "dictionary", eg: "اسمعي الكلمة بالفرنساوي والمصري واضغطي على صورتها!", fr: "Écoute le mot et touche l'image !" },
    { id: "inst_patterns", gameId: "patterns", eg: "ركزي في الترتيب واختاري الشكل اللي عليه الدور!", fr: "Complète la suite logique !" },
    { id: "inst_odd_one", gameId: "odd_one", eg: "في حاجة واحدة مختلفة وسط الصور دي، فين هي؟", fr: "Trouve l'intrus parmi les images !" },
    { id: "inst_puzzle", gameId: "puzzle", eg: "اضغطي على القطع عشان نركب الصورة الكاملة مع بعض!", fr: "Assemble les pièces du puzzle !" },
    { id: "inst_sorting", gameId: "sorting", eg: "شوفي الحاجة دي كبيرة ولا صغيرة أو تبع أنهي سلة واختاري الصح!", fr: "Classe l'objet dans le bon panier !" },
    { id: "inst_word_hunt", gameId: "word_hunt", eg: "اسمعي الكلمة واختاري الكتابة الفرنساوي بتاعتها!", fr: "Choisis le bon mot en français !" },
    { id: "inst_piano", gameId: "piano", eg: "اسمعي النغمة الأول وبعدين اعزفي زيها على البيانو!", fr: "Écoute la mélodie et répète-la !" },
    { id: "inst_emotions", gameId: "emotions", eg: "اختاري الوجه اللي بيعبر عن الشعور المطلوب!", fr: "Trouve la bonne émotion !" },
    { id: "inst_routine", gameId: "routine", eg: "اختاري الصورة المناسبة لوقتنا اليومي!", fr: "Choisis la bonne activité de la journée !" },
    { id: "inst_robot", gameId: "robot", eg: "حطي الأسهم بالترتيب عشان نوصّل الروبوت للنجمة!", fr: "Guide le petit robot jusqu'à l'étoile !" },
    { id: "inst_chef", gameId: "chef", eg: "ركزي في الطلب كويس واعملي الوصفة اللذيذة!", fr: "Prépare la recette demandée, petit chef !" },
    { id: "inst_maze", gameId: "maze", eg: "وصّلي الفراشة للوردة من غير ما تخبطي في الحيطان!", fr: "Aide le papillon à trouver la fleur dans le labyrinthe !" },
    { id: "inst_balance", gameId: "balance", eg: "حطي أرانب في الكفة الفاضية لحد ما الميزان يتساوى!", fr: "Équilibre la balance magique !" },
    { id: "inst_symmetry", gameId: "symmetry", eg: "ارسمي بإيدك وشوفي السحر بيرسم الناحية التانية زيك!", fr: "Dessine et regarde la magie de la symétrie !" },
    { id: "inst_director", gameId: "director", eg: "اختاري الشخصيات وسجلي حكاية جميلة بصوتك!", fr: "Crée ton histoire et enregistre ta voix !" }
  ],

  // 3. الحروف الفرنسية (A-Z)
  alphabet: [
    { id: "let_A", letter: "A", wordFr: "Avion", wordEg: "طيارة", icon: "✈️" },
    { id: "let_B", letter: "B", wordFr: "Banane", wordEg: "موزة", icon: "🍌" },
    { id: "let_C", letter: "C", wordFr: "Chat", wordEg: "قطة", icon: "🐱" },
    { id: "let_D", letter: "D", wordFr: "Dauphin", wordEg: "دولفين", icon: "🐬" },
    { id: "let_E", letter: "E", wordFr: "Éléphant", wordEg: "فيل", icon: "🐘" },
    { id: "let_F", letter: "F", wordFr: "Fraise", wordEg: "فراولة", icon: "🍓" },
    { id: "let_G", letter: "G", wordFr: "Girafe", wordEg: "زرافة", icon: "🦒" },
    { id: "let_H", letter: "H", wordFr: "Hibou", wordEg: "بومة", icon: "🦉" },
    { id: "let_I", letter: "I", wordFr: "Île", wordEg: "جزيرة", icon: "🏝️" },
    { id: "let_J", letter: "J", wordFr: "Jus", wordEg: "عصير", icon: "🧃" },
    { id: "let_K", letter: "K", wordFr: "Koala", wordEg: "كوالا", icon: "🐨" },
    { id: "let_L", letter: "L", wordFr: "Lion", wordEg: "أسد", icon: "🦁" },
    { id: "let_M", letter: "M", wordFr: "Maison", wordEg: "بيت", icon: "🏠" },
    { id: "let_N", letter: "N", wordFr: "Nuage", wordEg: "سحابة", icon: "☁️" },
    { id: "let_O", letter: "O", wordFr: "Orange", wordEg: "برتقالة", icon: "🍊" },
    { id: "let_P", letter: "P", wordFr: "Pomme", wordEg: "تفاحة", icon: "🍎" },
    { id: "let_Q", letter: "Q", wordFr: "Quatre", wordEg: "رقم أربعة", icon: "4️⃣" },
    { id: "let_R", letter: "R", wordFr: "Roi", wordEg: "ملك", icon: "👑" },
    { id: "let_S", letter: "S", wordFr: "Soleil", wordEg: "شمس", icon: "☀️" },
    { id: "let_T", letter: "T", wordFr: "Tortue", wordEg: "سلحفاة", icon: "🐢" },
    { id: "let_U", letter: "U", wordFr: "Uniforme", wordEg: "زي موحد", icon: "🥋" },
    { id: "let_V", letter: "V", wordFr: "Voiture", wordEg: "عربية", icon: "🚗" },
    { id: "let_W", letter: "W", wordFr: "Wagon", wordEg: "عربة قطار", icon: "🚃" },
    { id: "let_X", letter: "X", wordFr: "Xylophone", wordEg: "إكسيليفون", icon: "🎶" },
    { id: "let_Y", letter: "Y", wordFr: "Yaourt", wordEg: "زبادي", icon: "🥣" },
    { id: "let_Z", letter: "Z", wordFr: "Zèbre", wordEg: "حمار وحشي", icon: "🦓" }
  ],

  // 4. الألوان والأرقام
  colors: [
    { id: "col_red", fr: "Rouge", eg: "أحمر", hex: "#FF4D4D" },
    { id: "col_blue", fr: "Bleu", eg: "أزرق", hex: "#3B82F6" },
    { id: "col_yellow", fr: "Jaune", eg: "أصفر", hex: "#FACC15" },
    { id: "col_green", fr: "Vert", eg: "أخضر", hex: "#22C55E" },
    { id: "col_orange", fr: "Orange", eg: "برتقالي", hex: "#F97316" },
    { id: "col_purple", fr: "Violet", eg: "بنفسجي", hex: "#A855F7" },
    { id: "col_pink", fr: "Rose", eg: "بمبي", hex: "#EC4899" },
    { id: "col_brown", fr: "Marron", eg: "بني", hex: "#854D0E" }
  ],

  numbers: [
    { id: "num_1", val: 1, fr: "Un", eg: "واحد" },
    { id: "num_2", val: 2, fr: "Deux", eg: "اتنين" },
    { id: "num_3", val: 3, fr: "Trois", eg: "تلاتة" },
    { id: "num_4", val: 4, fr: "Quatre", eg: "أربعة" },
    { id: "num_5", val: 5, fr: "Cinq", eg: "خمسة" },
    { id: "num_6", val: 6, fr: "Six", eg: "ستة" },
    { id: "num_7", val: 7, fr: "Sept", eg: "سبعة" },
    { id: "num_8", val: 8, fr: "Huit", eg: "تمانية" },
    { id: "num_9", val: 9, fr: "Neuf", eg: "تسعة" },
    { id: "num_10", val: 10, fr: "Dix", eg: "عشرة" }
  ],

  // 5. القاموس الموسع (حيوانات، فواكه، عائلة، جسم الإنسان، وجمل فرنسية يومية)
  words: [
    { id: "w_cat", cat: "حيوانات", fr: "Le chat", eg: "قطة", icon: "🐱" },
    { id: "w_dog", cat: "حيوانات", fr: "Le chien", eg: "كلب", icon: "🐶" },
    { id: "w_rabbit", cat: "حيوانات", fr: "Le lapin", eg: "أرنب", icon: "🐰" },
    { id: "w_lion", cat: "حيوانات", fr: "Le lion", eg: "أسد", icon: "🦁" },
    { id: "w_elephant", cat: "حيوانات", fr: "L'éléphant", eg: "فيل", icon: "🐘" },
    { id: "w_fish", cat: "حيوانات", fr: "Le poisson", eg: "سمكة", icon: "🐠" },
    { id: "w_bird", cat: "حيوانات", fr: "L'oiseau", eg: "عصفورة", icon: "🐦" },
    { id: "w_butterfly", cat: "حيوانات", fr: "Le papillon", eg: "فراشة", icon: "🦋" },
    { id: "w_apple", cat: "فواكه", fr: "La pomme", eg: "تفاحة", icon: "🍎" },
    { id: "w_banana", cat: "فواكه", fr: "La banane", eg: "موزة", icon: "🍌" },
    { id: "w_strawberry", cat: "فواكه", fr: "La fraise", eg: "فراولة", icon: "🍓" },
    { id: "w_grapes", cat: "فواكه", fr: "Le raisin", eg: "عنب", icon: "🍇" },
    { id: "w_watermelon", cat: "فواكه", fr: "La pastèque", eg: "بطيخة", icon: "🍉" },
    { id: "w_carrot", cat: "خضروات", fr: "La carotte", eg: "جزرة", icon: "🥕" },
    { id: "w_car", cat: "مواصلات", fr: "La voiture", eg: "عربية", icon: "🚗" },
    { id: "w_plane", cat: "مواصلات", fr: "L'avion", eg: "طيارة", icon: "✈️" },
    { id: "w_train", cat: "مواصلات", fr: "Le train", eg: "قطر", icon: "🚂" },
    { id: "w_boat", cat: "مواصلات", fr: "Le bateau", eg: "مركب", icon: "⛵" },
    { id: "w_sun", cat: "طبيعة", fr: "Le soleil", eg: "شمس", icon: "☀️" },
    { id: "w_moon", cat: "طبيعة", fr: "La lune", eg: "قمر", icon: "🌙" },
    { id: "w_star", cat: "طبيعة", fr: "L'étoile", eg: "نجمة", icon: "⭐" },
    { id: "w_flower", cat: "طبيعة", fr: "La fleur", eg: "وردة", icon: "🌸" },
    { id: "w_papa", cat: "العائلة", fr: "Papa", eg: "بابا", icon: "👨" },
    { id: "w_maman", cat: "العائلة", fr: "Maman", eg: "ماما", icon: "👩" },
    { id: "w_bebe", cat: "العائلة", fr: "Le bébé", eg: "نونو صغير", icon: "👶" },
    { id: "w_main", cat: "جسم الإنسان", fr: "La main", eg: "إيد", icon: "✋" },
    { id: "w_oeil", cat: "جسم الإنسان", fr: "L'œil", eg: "عين", icon: "👁️" },
    { id: "w_bouche", cat: "جسم الإنسان", fr: "La bouche", eg: "بق", icon: "👄" },
    { id: "w_coeur", cat: "جمل يومية", fr: "Je t'aime", eg: "بحبك", icon: "❤️" },
    { id: "w_merci", cat: "جمل يومية", fr: "Merci beaucoup", eg: "شكراً جزيلاً", icon: "🙏" },
    { id: "w_bonjour", cat: "جمل يومية", fr: "Bonjour !", eg: "صباح الخير", icon: "👋" },
    { id: "w_eau", cat: "جمل يومية", fr: "De l'eau", eg: "مية", icon: "💧" },
    { id: "w_happy", cat: "مشاعر", fr: "Contente", eg: "فرحانة", icon: "😊" },
    { id: "w_sad", cat: "مشاعر", fr: "Triste", eg: "زعلانة", icon: "😢" },
    { id: "w_surprised", cat: "مشاعر", fr: "Surprise", eg: "متفاجئة", icon: "😮" },
    { id: "w_angry", cat: "مشاعر", fr: "Fâchée", eg: "غضبانة", icon: "😠" }
  ],

  // 6. ألبوم الـ 24 ملصق كرتوني (Stickers)
  stickers: [
    { id: "stk_1", icon: "🦄", fr: "La licorne", eg: "يونيكورن سحري" },
    { id: "stk_2", icon: "👸", fr: "La princesse", eg: "أميرة جميلة" },
    { id: "stk_3", icon: "🧚‍♀️", fr: "La fée", eg: "جنية الفراشات" },
    { id: "stk_4", icon: "🧜‍♀️", fr: "La sirène", eg: "عروسة البحر" },
    { id: "stk_5", icon: "🦋", fr: "Papillon d'or", eg: "فراشة ذهبية" },
    { id: "stk_6", icon: "🌈", fr: "Arc-en-ciel", eg: "قوس قزح" },
    { id: "stk_7", icon: "👑", fr: "Couronne royale", eg: "تاج الملكة" },
    { id: "stk_8", icon: "🐼", fr: "Petit panda", eg: "باندا لطيف" },
    { id: "stk_9", icon: "🐨", fr: "Koala doux", eg: "كوالا ناعم" },
    { id: "stk_10", icon: "🐬", fr: "Dauphin bleu", eg: "دولفين البحر" },
    { id: "stk_11", icon: "🦩", fr: "Flamant rose", eg: "فلامنجو وردي" },
    { id: "stk_12", icon: "🐧", fr: "Pingouin", eg: "بطريق ظريف" },
    { id: "stk_13", icon: "🍓", fr: "Fraise sucrée", eg: "فراولة مسكرة" },
    { id: "stk_14", icon: "🧁", fr: "Petit gâteau", eg: "كب كيك لذيذ" },
    { id: "stk_15", icon: "🍦", fr: "Glace vanille", eg: "آيس كريم" },
    { id: "stk_16", icon: "🍭", fr: "Sucette", eg: "مصاصة ملونة" },
    { id: "stk_17", icon: "🚀", fr: "Fusée spatiale", eg: "صاروخ الفضاء" },
    { id: "stk_18", icon: "🪐", fr: "Planète Saturne", eg: "كوكب زحل" },
    { id: "stk_19", icon: "🌟", fr: "Étoile brillante", eg: "نجمة لامعة" },
    { id: "stk_20", icon: "🎨", fr: "Palette d'artiste", eg: "لوحة الفنانة" },
    { id: "stk_21", icon: "🎹", fr: "Piano magique", eg: "بيانو الموسيقى" },
    { id: "stk_22", icon: "🧸", fr: "Ours en peluche", eg: "دبدوب دافي" },
    { id: "stk_23", icon: "🎈", fr: "Ballon rouge", eg: "بالونة طايرة" },
    { id: "stk_24", icon: "🏆", fr: "Coupe d'or", eg: "كأس البطلة" }
  ],

  // 7. القصص التفاعلية
  stories: [
    {
      id: "story_rabbit",
      titleEg: "الأرنب الذكي والجزرة السحرية 🐰",
      titleFr: "Le lapin malin et la carotte magique",
      icon: "🐰",
      pages: [
        { icon: "🐰", eg: "كان يا ما كان أرنب صغير اسمه بونبون بيحب يساعد كل أصحابه في الغابة.", fr: "Il était une fois un petit lapin nommé Bonbon qui aimait aider ses amis." },
        { icon: "🥕", eg: "في يوم لقى جزرة كبيرة بتلمع تحت الشجرة، فقرر يقسمها مع السلحفاة والعصفور.", fr: "Un jour, il a trouvé une grande carotte brillante et l'a partagée avec ses amis." },
        { icon: "🎉", eg: "فرح أصحابه جداً وقالوا له: المشاركة بتخلي السعادة أكبر بكتير!", fr: "Ses amis étaient très heureux : le partage rend la joie encore plus grande !" }
      ]
    },
    {
      id: "story_stars",
      titleEg: "رحلة الأميرة إلى كوكب النجوم 🚀",
      titleFr: "Le voyage de la princesse vers les étoiles",
      icon: "🚀",
      pages: [
        { icon: "🚀", eg: "ركبت الأميرة الصغيرة صاروخها الفضي وطلعت فوق السحاب عشان تعد النجوم.", fr: "La petite princesse a pris sa fusée argentée pour compter les étoiles dans le ciel." },
        { icon: "🌙", eg: "قابلت القمر المبتسم وعلمها أسماء الكواكب والألوان بالفرنساوي.", fr: "Elle a rencontré la lune souriante qui lui a appris les couleurs en français." },
        { icon: "⭐", eg: "رجعت بيتها وهي معها نجمة منورة بتفكرها دايماً بحب العلم والاستكشاف.", fr: "Elle est rentrée chez elle avec une belle étoile brillante pleine de savoir." }
      ]
    },
    {
      id: "story_butterfly",
      titleEg: "الفراشة الملونة والحديقة السعيدة 🦋",
      titleFr: "Le papillon coloré et le jardin heureux",
      icon: "🦋",
      pages: [
        { icon: "🐛", eg: "في حديقة مليانة ورد، كانت فيه دودة صغيرة بتحلم تطير في السما.", fr: "Dans un jardin fleuri, une petite chenille rêvait de voler dans le ciel." },
        { icon: "🦋", eg: "صبرت واتعلمت، وبعد شوية بقت فراشة جميلة بأجنحة حمرا وزرقا وصفرا.", fr: "Avec de la patience, elle est devenue un magnifique papillon multicolore." },
        { icon: "🌸", eg: "طارت فوق الورد وغنت أجمل أغنية للصبر والأمل.", fr: "Elle a volé au-dessus des fleurs en chantant une douce mélodie." }
      ]
    },
    {
      id: "story_dolphin",
      titleEg: "الدولفين لولو وكنز البحر 🐬",
      titleFr: "Loulou le dauphin et le trésor de la mer",
      icon: "🐬",
      pages: [
        { icon: "🌊", eg: "في بحر إسكندرية الأزرق الجميل، كان بيعيش دولفين شقي اسمه لولو.", fr: "Dans la belle mer bleue, vivait un petit dauphin joyeux nommé Loulou." },
        { icon: "🐚", eg: "لقى لولو صدفة بتلمع جواها لؤلؤة، فرجعها لصاحبتها السمكة الذهبية.", fr: "Loulou a trouvé un coquillage brillant et l'a rendu au petit poisson d'or." },
        { icon: "🏆", eg: "كل أسماك البحر صفقت للولو لأنه أمين وبيحب الخير.", fr: "Tous les poissons ont applaudi Loulou parce qu'il est honnête et gentil." }
      ]
    },
    {
      id: "story_robot",
      titleEg: "الروبوت الصغير وتعلم النظام 🤖",
      titleFr: "Le petit robot apprend l'ordre",
      icon: "🤖",
      pages: [
        { icon: "🧸", eg: "كان الروبوت تيكو بيلعب بألعابه وبعدين يسيبها مرمية في الأوضة.", fr: "Le petit robot Tiko jouait avec ses jouets mais oubliait de les ranger." },
        { icon: "🧹", eg: "لما رتب ألعابه وغسل سنانه قبل النوم، لقى كل حاجة جاهزة الصبح.", fr: "Quand il a rangé ses jouets et brossé ses dents, tout était prêt le matin." },
        { icon: "🌟", eg: "أخد تيكو وسام البطل المنظم وبقى قدوة لكل أصحابه.", fr: "Tiko a reçu la médaille du champion bien organisé !" }
      ]
    },
    {
      id: "story_sisters",
      titleEg: "الأختان البطلتان ومغامرة المعرفة 👭",
      titleFr: "Les deux sœurs héroïnes",
      icon: "👭",
      pages: [
        { icon: "👸", eg: "الأخت الكبيرة الذكية كانت بتعلم أختها الصغيرة الحروف والأرقام بحب وصبر.", fr: "La grande sœur intelligente apprenait les lettres à sa petite sœur avec amour." },
        { icon: "🦄", eg: "والأخت الصغيرة الشطورة كانت بتسمع الكلام وتجاوب صح وتكسب نجوم.", fr: "Et la petite sœur écoutait attentivement et gagnait plein d'étoiles." },
        { icon: "❤️", eg: "وبالتعاون والحب بقوا أحلى فريق في الدنيا كلها!", fr: "Grâce à leur amour, elles formaient la meilleure équipe du monde !" }
      ]
    }
  ],

  // 8. قائمة الـ 14 لعبة
  games: [
    { id: "memory", nameEg: "تطابق البطاقات", nameFr: "Mémoire Magique", icon: "🃏", domain: "memory", color: "#FF6B6B" },
    { id: "shadows", nameEg: "لغز الظلال", nameFr: "Ombres & Formes", icon: "👤", domain: "visual", color: "#4ECDC4" },
    { id: "numbers", nameEg: "مزرعة الأرقام", nameFr: "Ferme des Nombres", icon: "🥕", domain: "logic", color: "#FFD166" },
    { id: "coloring", nameEg: "مرسم الألوان", nameFr: "Atelier d'Art", icon: "🎨", domain: "motor", color: "#FF9F1C" },
    { id: "alphabet", nameEg: "قطار الحروف", nameFr: "Train Alphabet", icon: "🚂", domain: "french", color: "#6A4C93" },
    { id: "dictionary", nameEg: "قاموس الأشياء", nameFr: "Mon Dictionnaire", icon: "📖", domain: "french", color: "#1982C4" },
    { id: "patterns", nameEg: "أكمل النمط", nameFr: "Suite Logique", icon: "🧩", domain: "logic", color: "#8AC926" },
    { id: "odd_one", nameEg: "اكتشف المختلف", nameFr: "Trouve l'Intrus", icon: "🔍", domain: "visual", color: "#FF595E" },
    { id: "puzzle", nameEg: "بازل الصور", nameFr: "Puzzle Géant", icon: "🖼️", domain: "visual", color: "#3A86FF" },
    { id: "sorting", nameEg: "فرز الألوان والأحجام", nameFr: "Tri Intelligent", icon: "🧺", domain: "logic", color: "#8338EC" },
    { id: "word_hunt", nameEg: "صيد الكلمات", nameFr: "Chasse aux Mots", icon: "🎯", domain: "french", color: "#FB5607" },
    { id: "piano", nameEg: "البيانو الذكي", nameFr: "Piano & Rythme", icon: "🎹", domain: "memory", color: "#06D6A0" },
    { id: "emotions", nameEg: "مرآة المشاعر", nameFr: "Miroir Émotions", icon: "🎭", domain: "visual", color: "#EF476F" },
    { id: "routine", nameEg: "روتيني والساعة", nameFr: "Ma Journée", icon: "⏰", domain: "logic", color: "#118AB2" },
    { id: "robot", nameEg: "المبرمجة الصغيرة", nameFr: "Petit Robot", icon: "🤖", domain: "logic", color: "#3B82F6" },
    { id: "chef", nameEg: "مطبخ الشيف", nameFr: "Petit Chef", icon: "👩‍🍳", domain: "memory", color: "#F97316" },
    { id: "maze", nameEg: "متاهة التركيز", nameFr: "Labyrinthe", icon: "🦋", domain: "motor", color: "#10B981" },
    { id: "balance", nameEg: "ميزان المنطق", nameFr: "Balance Magique", icon: "⚖️", domain: "logic", color: "#8B5CF6" },
    { id: "symmetry", nameEg: "الرسم المتماثل", nameFr: "Dessin Miroir", icon: "✨", domain: "visual", color: "#EC4899" },
    { id: "director", nameEg: "مخرجة الحكايات", nameFr: "Créateur Histoires", icon: "🎬", domain: "french", color: "#E11D48" }
  ]
};

window.LumiDictionary = LumiDictionary;
