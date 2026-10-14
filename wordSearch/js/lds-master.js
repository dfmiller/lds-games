var masterList = [
{
	'"The Living Christ"': ["advocate", "America", "ancient", "Apostles", "appeared", "arrested", "atone", "atoning", "baptized", "bearing", "Begotten", "behalf", "Bethlehem", "birth", "brightness", "built", "Calvary's", "central", "charges", "chief", "Christ", "Church", "commemorate", "concluded", "condemned", "convicted", "corner", "countenance", "created", "creator", "cross", "dead", "declared", "desires", "despised", "die", "direction", "dispensation", "divine", "earth", "entreated", "eternal", "eternity", "example", "existence", "Father", "Firstborn", "firstfruits", "flame", "flesh", "follow", "foundation", "fulfill", "fulness", "gave", "gift", "given", "glory", "God", "goodwill", "gospel", "grave", "great", "hand", "happiness", "head", "healing", "heard", "hearts", "himself", "history", "hope", "human", "Immanuel", "immortal", "infinite", "influence", "instituted", "Jehovah", "Jesus", "judged", "Kings", "knee", "last", "leads", "life", "light", "like", "lived", "lives!", "liveth", "Living", "long-promised", "Lords", "loved", "made", "mankind", "matchless", "message", "Messiah", "millennia", "ministered", "mob", "modern", "New", "offer", "Old", "Only", "ordained", "Palestine", "path", "peace", "potential", "premortal", "priesthood", "profound", "prophets", "pure", "purpose", "raising", "reality", "record", "Redeemer", "reign", "reminder", "restored", "return", "revealed", "righteousness", "Risen", "roads", "rose", "rule", "rushing", "sacrament", "sacrifice", "satisfy", "saying", "see", "sentenced", "sheep", "shone", "sick", "sinless", "sins", "slain", "slept", "solemnity", "solemnly", "someday", "sons", "sound", "speak", "spurious", "stands", "stone", "sun", "taught", "Testament", "testify", "testimonies", "testimony", "thanked", "times", "today", "tongue", "truths", "ushering", "vicarious", "virtue", "visited", "voice", "walked", "waters", "way", "went", "white", "words", "works", "worlds", "worship", "wrote"]
},

{
	"Sabbath": ["a sign", "assemble", "bear no burden", "blessed", "church", "commandment", "confessing", "delight", "devotions", "do good", "do well", "fast", "first day", "gather", "give thanks", "hallowed", "heal", "holy day", "honourable", "house of prayer", "hymns", "joy", "keep it", "loose bonds", "Lord of the sabbath", "Lord's day", "made for man", "not buy", "not work", "oblations", "observe", "of the Lord", "offer", "peace", "refreshed", "Remember", "rest", "sacraments", "sanctified", "save life", "scriptures", "seventh", "singleness of heart", "study", "teach", "unspotted", "worship"]
},

{
	"Church History People": ["Almon W. Babbitt", "Alpheus Cutler", "Alvin", "Amasa Lyman", "Ann Lee", "Brigham", "Charles C. Rich", "Cowdery", "David Fullmer", "David W. Patten", "Don Carlos", "Edward Partridge", "Emma", "Erastus Snow", "Ezra Booth", "Ezra T. Benson", "Ezra Thayre", "Frederick G. Williams", "George A.", "George Miller", "Hale", "Harris", "Harvey G. Whitlock", "Heber C. Kimball", "Hiram Page", "Hyrum", "Isaac Galland", "Isaac Morley", "Jared Carter", "Jesse Gause", "John C. Bennett", "John E. Page", "John F. Boynton", "John Gould", "John Murdock", "Joseph Coe", "Joseph Knight Sr.", "Josiah Butterfield", "Leman Copley", "Levi W. Hancock", "Lilburn W. Boggs", "Luke S. Johnson", "Lyman E. Johnson", "Lyman R. Sherman", "Lyman Wight", "Martin", "Newel K. Whitney", "Newel Knight", "Oliver Granger", "Orson Hyde", "Orson Pratt", "Parley P. Pratt", "Reynolds Cahoon", "Robert B. Thompson", "Samuel Bent", "Shadrach Roundy", "Sidney Gilbert", "Sidney Rigdon", "Smith", "Sylvester", "Symonds Ryder", "Taylor", "Thomas B. Marsh", "Titus Billings", "Vienna Jacques", "Vinson Knight", "W. W. Phelps", "Whitmer", "Wilford", "Willard Richards", "William E. McLellin", "William Huntington Sr", "William Law", "William Marks", "Woodruff", "Young", "Zebedee Coltrin", "Ziba Peterson"]

},


{
	"General Conference": ["Amen", "apostles", "Area Seventies", "auxiliaries", "benediction", "camera", "choir", "Church", "Conference Center", "congregation", "councilor", "doctrines", "dress", "First Presidency", "flowers", "General Authorities", "invocation", "Jesus Christ", "microphone", "organ", "plants", "podium", "prayers", "President", "Presiding Bishopric", "Primary", "principles", "prophets", "pulpit", "Quorum of the Twelve", "Relief Society", "revelators", "Salt Lake City", "seats", "seers", "semi-annual", "Seventy", "singing", "speaker", "statistical report", "suit", "Sunday School", "sustain", "Tabernacle", "talks", "teleprompter", "testimony", "truth", "Young Men", "Young Women"]
},

{
	"Book of Mormon Cities": ["Aaron", "Ablom", "Ammonihah", "Angola", "Ani-Anti", "Antiparah", "Boaz", "Bountiful", "Cumeni", "Desolation", "Gadiandi", "Gadiomnah", "Gideon", "Gilgal", "Gimgimno", "Helam", "Jacobugath", "Jashon", "Jershon", "Jerusalem", "Jordan", "Josh", "Judea", "Kishkumen", "Lehi-Nephi", "Lemuel", "Manti", "Melek", "Mocum", "Morianton", "Moronihah", "Mulek", "Nehor", "Nephihah", "Noah", "Omner", "Shem", "Shilom", "Shimnilom", "Teancum", "Zarahemla", "Zeezrom"]
},

{
	"Book of Mormon Places": ["Agosh", "Akish", "Alma", "Amnihu", "Amulon", "Antionum", "Antipas", "borders west", "cavity of a rock", "Comnor", "Corihor", "Cumorah", "Desolation", "Ephraim", "Hermounts", "Heshlon", "Irreantum", "Ishmael", "Jershon", "Joshua", "land northward", "Midian", "Minon", "Moreh", "Moriancumer", "narrow neck of land", "Nephi", "Nimrod", "Ogath", "Ramah", "Riplah", "Ripliancum", "seashore", "Sebus", "Shazer", "Shelem", "Shemlon", "Sherrizah", "Shim", "Shurr", "Sidom", "Sidon", "Siron", "Waters of Mormon", "west sea", "Zerin", "land northward"]
},

    {
        "The Temple": ["altar", "Angel Moroni", "anointings", "baptisms", "blessings", "Celestial", "covenants", "creation", "endowment", "eternal", "families", "family history", "font", "foyer", "gardens", "garments", "grounds", "Holiness to the Lord", "holy", "House of the Lord", "initiatory", "Jesus Christ", "joy", "love", "marriage", "matron", "names", "open house", "ordinances", "peace", "prayer roll", "president", "priesthood", "proxy", "recommend", "robes", "sacred", "sealing", "spires", "stained glass", "symbolic", "temple bag", "temple work", "twelve oxen", "vicarious", "visitor's center", "washings", "white", "workers", "worthy"]
    },

    {
        "Missionaries": ["appointment", "area", "assistants", "baptism", "Bible", "bicycle", "blessing", "Book of Mormon", "companion", "conference", "contact", "convert", "Dear John", "discussion", "district", "district leader", "eighteen", "Elder", "First Vision", "golden", "greenies", "investigators", "Jesus the Christ", "lessons", "letters", "mission", "MTC", "nineteen", "Our Heritage", "Our Search for Happiness", "P-day", "pamphlets", "plan", "prayer", "Preach My Gospel", "president", "proselyting", "referral", "rules", "scriptures", "senior", "service", "Sister", "splits", "standard works", "study", "suit", "teaching", "testimony", "tie", "tracting", "trainer", "True to the Faith", "ward mission leader", "white shirt", "zone"]
    },


    {

        "Money": ["amnor", "assarion", "atonement money", "balances", "bronze", "coinage", "denarius", "didrachmon", "drachme", "dram", "ezrom", "farthing", "gold", "half-shekel", "kodrantes", "leahs", "lend", "lepton", "limnah", "mina", "mite", "money changers", "moneys", "onti", "penny", "piece of money", "pounds", "quadrans", "scrip", "senine", "senum", "seon", "shekels", "shiblons", "shiblums", "shum", "silver", "stater", "sum of money", "talents", "thirty pieces of silver", "treasury", "tribute", "tribute money", "usury", "weights"]
    },


/*
    {

        "Young Women's": ["advisor", "arise", "auxiliary", "beehives", "Choice", "Accountability", "Christlike", "councilors", "daughter", "Divine Nature", "encouragement", "Faith", "girl's camp", "Good Works", "in excellence", "Individual Worth", "instruction", "Integrity", "Knowledge", "laurels", "leader", "light", "logo", "medallion", "Mia maids", "mother", "motto", "Mutual", "new beginnings", "organization", "personal progress", "presidency", "president", "Righteousness", "secretary", "shine forth", "Stand", "standard", "support", "theme", "torch", "Truth", "Virtue", "young women"]

    },
*/

    {

        "Charity": ["aid", "beareth", "believeth", "benevolent", "blessing", "child-like", "cleave", "compassion", "endureth", "envieth not", "faith", "forbearance", "forever", "generosity", "goodwill", "greatest", "helpfulness", "highest", "hopeth", "kind", "non-judgmental", "like Him", "love of humanity", "lowly of heart", "meek", "mercy", "never faileth", "no evil", "noblest", "not easily provoked", "not puffed up", "not unseemly", "of Christ", "perfect", "pure love", "purified", "rejoiceth", "relief", "seeketh not her own", "strongest", "suffereth long", "tolerance", "unselfish", "vaunteth not"]

    },


    {

        "Scriptures": ["Bible", "Book of Mormon", "bookmark", "canon", "commandments", "dictionary", "Doctrine and Covenants", "faith", "footnotes", "for correction", "for doctrine", "for instruction", "for reproof", "golden plates", "gospels", "holy writ", "inspiration of God", "inspired", "Jesus Christ", "JST", "judgments", "King James", "law", "maps", "New Testament", "Old Testament", "Pearl of Great Price", "ponder", "pray", "prophets", "pure", "read", "record", "revealed", "righteousness", "sacred", "scriptures", "standard works", "statutes", "study", "sure", "testimony", "topical guide", "translated", "triple combination", "true", "Word of God"]

    },


    {

        "Priesthood": ["Aaronic", "administer", "advisor", "Apostle", "authorize", "baptize", "Bishop", "bless", "called", "chosen", "clerk", "confirm", "consecrated", "councilors", "covenant", "Deacons", "duties", "Elder", "endow", "fast offering", "High Priest", "home teach", "instructor", "keys", "manual", "Melchizedek", "mission", "oath", "olive oil", "ordain", "passing", "prepare", "preside", "president", "Priests", "quorum", "seal", "secretary", "serve", "set apart", "Seventy", "Teachers", "laying on of hands"]

    },


    {

        "Plagues & Destructions": ["affrighted", "battle", "bitterness", "boils", "burning", "darkened", "dearth", "death", "despair", "destruction", "devour", "disease", "drought", "earthquake", "enemies", "famine", "fire", "flee", "flies", "floods", "hail", "hearts failing", "hunger", "hurt", "lice", "lightnings", "locus", "pestilence", "pollutants", "scorpions", "serpents", "sickness", "slay", "smitten", "smoke", "sword", "tempest", "thirst", "thunderings", "torment", "toxins", "tribulation", "tsunami", "war", "windstorm", "woe"]

    },


    {

        "New Testament Cities": ["Amphipolis", "Antioch", "Antipatris", "Apollonia", "Athens", "Azotus", "Berea", "Bethabara", "Bethany", "Bethlehem", "Bethsaida", "Caesarea", "Cana", "Capernaum", "Chorazin", "Corinth", "Damascus", "Derbe", "Emmaus", "Ephesus", "Gaza", "Iconium", "Jericho", "Jerusalem", "Joppa", "Laodicea", "Lystra", "Magdala", "Miletus", "Mitylene", "Myra", "Nain", "Nazareth", "Paphos", "Patara", "Pergamos", "Philadelphia", "Philippi", "Ptolemais", "Puteoli", "Rhegium", "Rome", "Salamis", "Sardis", "Sidon", "Smyrna", "Sychar", "Syracuse", "Tarsus", "Thessalonica", "Thyatira", "Tiberias", "Troas", "Tyre"]

    },


    {

        '"I am a Child of God"': ["a child", "all that", "an earthly home", "And so", "are great", "are in store", "are sure", "Before", " endure", " learn", "Celestial glory", "find the way", "guide me", "Has given me", "he has", "Help me", "His promises", "his will", "his words", "I am", "I must do", "I'll live", "If I can", "it grows", "kind and dear", "Lead me", "my needs", "of God", "once more", "Rich blessings", "sent me here", "shall be mine", "someday", "Teach", "to do", "To live", "understand", "too late", "walk beside me", "with him", "With parents"]

    },


    {

        '"If You Could Hie to Kolob"': ["abound", "above", "began", "beginning", "being", "contemplation", "continue", "Could", "creation", "curtains", "death", "eternal", "eternity", "ever", "extend", "eye", "Find", "found", "generation", "glory", "Gods", "grand", "Hie", "Improvement", "Kolob", "last", "light", "lives", "love", "man", "matter", "Methinks", "might", "no end", "Nor", "nothing", "one", "onward", "outside", "place", "priesthood", "progression", "pure", "race", "round", "same", "seen", "space", "speed", "Spirit", "think", "truth", "twinkling", "union", "view", "virtue", "Where", "whispers", "wisdom", "works", "worlds", "youth"]

    },


    {

        "Plan of Salvation": ["agency", "atonement", "birth", "body", "Celestial", "creation", "death", "degrees", "eternity", "experience", "forgetfulness", "glory", "grace", "happiness", "Heavenly Father", "honorable", "immortality", "infinite", "intelligence", "judgment", "kingdoms", "life", "mercy", "mortal", "Outer darkness", "Paradise", "perfected", "physical", "post mortal", "pre-earth life", "premortal", "Prison", "repent", "rest", "resurrection", "Savior", "sin", "spirit", "Telestial", "Terrestrial", "the Fall", "trials", "veil"]

    },


    {

        '"The Spirit of God"': ["abroad", "Amen", "angels", "armies", "assemblies", "begins", "blessings", "burning", "burst", "call", "chariot", "Chorus", "coming", "crowned", "day", "descends", "down", "earth", "Ephraim", "expanding", "extending", "faith", "fire", "first", "forever", "forth", "given", "glories", "glory", "God", "heaven", "Henceforth", "highest", "Hosanna", "inherit", "Jesus", "judges", "kingdom", "knowledge", "Lamb", "latter-day", "lion", "Lord", "power", "Restoring", "returning", "Saints'", "Shall", "shout", "sing", "solemn", "Spirit", "spread", "together", "understanding", "veil", "visions", "visit", "Zion"]

    },

/*
    {

        "Young Women's Theme": ["accept", "Accountability", "act", "in all places", "and in all things", "at all times", "BE PREPARED", "blessings", "Choice", "covenants", "DAUGHTERS", "Divine Nature", "enjoy", "exaltation", "Faith", "family", "Good Works", "Heavenly Father", "home", "Individual Worth", "Integrity", "keep", "Knowledge", "make", "of God", "ordinances", "receive", "sacred", "STAND", "strengthen", "the temple", "to live", "values", "Virtue", "WE ARE", "WE BELIEVE", "we love Him", "we strive", "WE WILL", "which are", "who loves us", "witnesses", "Young Women"]

    },
*/

    {

        "Scriptual Objects": ["altar", "anchor", "apparel", "ark", "armor", "arrow", "axe", "balances", "banner", "barns", "basket", "beam", "bed", "bell", "brass", "bread", "breastplate", "bricks and slime", "chain", "chariot", "cistern", "cloak", "closet", "cord", "cup", "cymbal", "door", "eye salve", "flour", "fortress", "furnace", "garment", "hammer", "harp", "helmet", "house", "iron", "lamp", "linen", "loaves", "manna", "nail", "net", "ointment", "pillar", "plumbline", "rod", "scarlet", "sickle", "sieve", "soap", "staff", "stone", "sword", "tent", "throne", "tower", "trumpet", "well", "wheel", "window"]

    },


    {

        "Callings": ["Accompanist", "Advisor", "Assistant", "Athletic", "Bishop", "Bulletin", "Camp", "Cannery", "Chairman", "Choir", "Chorister", "Clerk", "Compassionate Service", "Conductor", "Consultant", "Coordinator", "Counselor", "Deacons", "Director", "District", "Elders", "Employment", "Executive", "Family History", "Finance", "First", "Gospel Doctrine", "Gospel Essentials", "Greeter", "High Councilman", "Historian", "Humanitarian", "Instructor", "Leadership", "Librarian", "Library", "Membership", "Missionary", "Music", "Nursery", "Organist", "Pianist", "President", "Primary", "Quorum", "Relief Society", "Representative", "Scheduler", "Second", "Secretary", "Single Adult Rep", "Specialist", "Stake", "Sunbeam", "Sunday School", "Supervisor", "Teachers", "Valiant", "Visiting Teaching", "Ward", "Welfare", "Young Men", "Young Women", "YSA"]

    },


    {

        "Parables": ["beam", "bridegroom", "bushel", "candle", "debtors", "faithful", "feast", "fig tree", "foolish man", "friend", "husbandman", "judge", "king", "Lazarus", "lost sheep", "mote", "mustard seed", "net", "new cloth", "old bottles", "old garment", "pearl", "pharisee", "prodigal", "rock", "Samaritan", "sand", "seed", "servant", "shepherd", "silver coins", "sower", "steward", "talents", "tares", "temple", "tower", "treasure", "unclean", "unfruitful", "vineyard", "virgins", "watchful", "wedding", "widow", "wise man"]

    },


    {

        "Articles of Faith": ["Adam", "administer", "admonition of Paul", "Almighty God", "American continent", "apostles", "atonement", "authority", "Baptism", "being honest", "benevolent", "Bible", "Book of Mormon", "by immersion", "by prophecy", "called of God", "chaste", "conscience", "dictates", "doing good", "endure all things", "endured many things", "Eternal Father", "evangelists", "Faith", "gathering of Israel", "gift of tongues", "Gospel", "great and important things", "healing", "Holy Ghost", "honoring", "interpretation of tongues", "Jesus Christ", "Kingdom of God", "Laying on of hands", "lovely", "magistrates", "mankind", "New Jerusalem", "obedience", "obeying", "of good report", "ordinances", "organization", "own sins", "paradisiacal glory", "pastors", "praiseworthy", "preach the Gospel", "presidents", "Primitive Church", "prophecy", "prophets", "reign personally", "remission of sins", "renewed", "Repentance", "revelation", "rulers", "same privilege", "saved", "subject to kings", "sustaining the law", "teachers", "Ten Tribes", "transgression", "translated correctly", "true", "virtuous", "visions", "We believe", "We claim", "we hope all things", "we seek after these things", "word of God", "worship", "worshiping", "yet reveal", "Zion"]

    },


    {

        "Bible Women": ["Abigail", "Anna", "Asenath", "Athaliah", "Bathsheba", "Bilhah", "Cozbi", "Deborah", "Delilah", "Dinah", "Dorcas", "Elisabeth", "Esther", "Eve", "Gomer", "Hadassah", "Hagar", "Hannah", "Jael", "Jairus' daughter", "Jezebel", "Joanna", "Job's wife", "Jochebed", "Leah", "Lot's wife", "Lydia", "Martha", "Mary Magdalene", "Michal", "Miriam", "Mother of James and John", "Naomi", "Noah's wife", "Orpah", "Peters mother-in-law", "Pharaoh's daughter", "Pilate's wife", "Poor widow", "Potiphar's wife", "Priscilla", "Queen of Sheba", "Queen Vashti", "Rachel", "Rahab", "Rebekah", "Ruth", "Salome", "Sapphira", "Sarah", "Shiphrah", "Tabitha", "Tamar", "Virgin Mary", "Widow of Naim", "Woman at the well", "Zilpah", "Zipporah"]

    },



    {

        "Law of Moses": ["Aaronic Priesthood", "altar", "ark of the covenant", "blessings", "Book of Joshua", "burnt offering", "carnal commandments", "ceremonial", "covenant", "cursings", "Day of Atonement", "Deuteronomy", "dough offering", "drink offering", "duties", "Exodus", "Feast of Tabernacles", "Feast of Unleavened Bread", "Feast of Weeks", "feasts", "first fruits", "Five Books of Moses", "fulfilled", "heave offering", "Holy of Holies", "incense offering", "instruction", "Law of Moses", "Levite priests", "Leviticus", "meal offering", "moral laws", "Mount Ebal", "Mount Sinai", "Numbers", "obligation", "offerings", "Passover", "peace offering", "Pentateuch", "performances", "preparatory", "prohibitions", "purity", "red heifer", "reminder", "remission of sins", "responsibilities", "rituals", "Sabbatical Year", "sacrifices", "scapegoat", "sin offering", "social laws", "symbols", "Ten Commandments", "thank offering", "The house of Israel", "theocracy", "Torah", "twelve tribes of Israel", "unclean", "wave offering", "whole offering", "written laws"]

    },

    {

        "International Temples": ["Aba", "Accra", "Adelaide", "Apia", "Arequipa", "Asuncion", "Barranquilla", "Bern", "Bogota", "Brisbane", "Buenos Aires", "Calgary", "Campinas", "Caracas", "Cardston", "Cebu City", "Ciudad Juarez", "Cochabamba", "Colonia Juarez", "Concepcion", "Copenhagen", "Curitiba", "Cordoba", "Durban", "Edmonton", "Fortaleza", "Frankfurt", "Freiberg", "Fukuoka", "Guadalajara", "Guatemala City", "Guayaquil", "Halifax", "Hamilton", "Helsinki", "Hermosillo", "Hong Kong", "Johannesburg", "Kinshasa", "Kyiv", "Lima", "Lisbon", "London", "Madrid", "Manaus", "Manila", "Melbourne", "Mexico City", "Monterrey", "Montevideo", "Montreal", "Merida", "Nuku'alofa", "Oaxaca", "Panama City", "Papeete", "Paris", "Perth", "Porto Alegre", "Preston", "Quetzaltenango", "Recife", "Regina", "Rio de Janeiro", "Rome", "San Jose", "San Salvador", "Santiago", "Santo Domingo", "Sapporo", "Seoul", "Stockholm", "Suva", "Sydney", "Sao Paulo", "Taipei", "Tampico", "Tegucigalpa", "The Hague", "Tijuana", "Tokyo", "Toronto", "Trujillo", "Tuxtla Gutierrez", "Urdaneta", "Vancouver", "Veracruz", "Villahermosa", "Winnipeg"]

    },


    {

        "US Temples": ["Albuquerque", "Anchorage", "Atlanta", "Baton Rouge", "Billings", "Birmingham", "Bismarck", "Boise", "Boston", "Bountiful", "Brigham City", "Cedar City", "Chicago", "Columbia", "Columbia River", "Columbus", "Dallas", "Denver", "Detroit", "Draper", "Fort Collins", "Fort Lauderdale", "Fresno", "St. George", "Gila Valley", "Gilbert", "Hartford", "Houston", "Idaho Falls", "Indianapolis", "Jordan River", "Kansas City", "Kona", "Laie", "Las Vegas", "Logan", "Los Angeles", "St. Louis", "Louisville", "Lubbock", "Manhattan", "Manti", "Medford", "Memphis", "Meridian", "Mesa", "Monticello", "Mount Timpanogos", "Nashville", "Nauvoo", "Newport Beach", "Oakland", "Ogden", "Oklahoma City", "Oquirrh Mountain", "Orlando", "Palmyra", "St. Paul", "Payson", "Philadelphia", "Phoenix", "Portland", "Provo", "Provo City Center", "Raleigh", "Redlands", "Reno", "Rexburg", "Sacramento", "Salt Lake", "San Antonio", "San Diego", "Seattle", "Snowflake", "Spokane", "Star Valley", "Tucson", "Twin Falls", "Vernal", "Washington D.C.", "Winter Quarters"]

    },



    {

        "Historic Places": ["Adam-ondi-Ahman", "Assembly Hall", "Beehive House", "Brigham Young Winter Home", "Carthage Jail", "Church Administration Building", "Cody Murals Chapel", "Colesville", "Conference Center", "Council Bluffs", "Cove Fort", "Family History Library", "Far West", "Fort Bridger", "Gadfield Elm Chapel", "Gallatin", "Garden Grove", "Grandin Building", "Harmony", "Haun's Mill", "Hill Cumorah", "Hiram", "Illinois", "Independence", "Iowa", "Jerusalem Center", "John Johnson Home", "Joseph Smith Birthplace", "Kanesville Tabernacle", "Kirtland", "Liberty Jail", "Lion House", "Manchester", "Martin's Cove", "Missouri", "Mormon Battalion Historic Site", "Mormon Trail Center", "Mt Pisgah", "Nauvoo", "New York", "Ohio", "Palmyra", "Peter Whitmer Log Home", "Pioneer Trail", "Polynesian Cultural Center", "Quincy", "Red Brick Store", "Richmond", "Sacred Grove", "Salt Lake City Tabernacle", "San Diego", "Sharon", "Smith Family Farm", "Susquehanna River", "Temple Square", "Utah", "Vermont", "Whitney Store", "Willie Center", "Winter Quarters", "Wyoming"]

    },



    {

        "Ten Commandments": ["adultery", "blessed", "bow down", "commandments", "covenant", "covet", "false witness", "father", "graven image", "hallowed", "holy", "Honour", "Horeb", "idolatry", "jealous", "judgments", "kill", "likeness", "Lord thy God", "love", "lying", "mercy", "Moses", "mother", "murder", "name in vain", "neighbour", "no other gods", "remember", "rested", "Sabbath", "sacrifice", "sanctify", "serve", "seventh day", "Sinai", "six days", "statutes", "steal", "stranger", "swearing", "Thou shalt", "two tables", "worship"]

    },


    {

        "Biblical Animals": ["antelope", "ape", "asp", "baboon", "badger", "bat", "bear", "beetle", "bird", "bittern", "boar", "buffalo", "bullock", "buzzard", "calf", "camel", "cankerworm", "cattle", "chameleon", "cobra", "cockatrice", "cow", "crane", "cricket", "crocodile", "cuckoo", "deer", "dog", "eagle", "elephant", "ewe", "falcon", "fawn", "fish", "flea", "flock", "fly", "fowl", "fox", "frog", "gazelle", "gecko", "giraffe", "gnat", "goat", "grasshopper", "hare", "hart", "hawk", "hedgehog", "heron", "hind", "hippopotamus", "hornet", "horse", "jackal", "kid", "kine", "lamb", "ibex", "leopard", "lion", "lizard", "locust", "mole", "mosquito", "moth", "mouse", "mule", "osprey", "ostrich", "owl", "partridge", "pelican", "pigeon", "porcupine", "quail", "rabbit", "ram", "rat", "raven", "rhinoceros", "rooster", "scorpion", "sea gull", "seal", "serpent", "shrew", "sparrow", "spider", "stork", "swallow", "swan", "swine", "tiger", "turtle", "turtle dove", "unicorn", "viper", "vulture", "weasel", "whale", "wolf", "worm"]

    },


    {

        "Prophets": ['Aaron', 'Abel', 'Abraham', 'Agabus', 'Agur', 'Ahijah', 'Amos', 'Anna', 'Asaph', 'Azariah', 'Barnabas', 'Daniel', 'David', 'Deborah', 'Elijah', 'Elisha', 'Enoch', 'Ezekiel', 'Gad', 'Habakkuk', 'Haggai', 'Hosea', 'Huldah', 'Iddo', 'Isaiah', 'Jacob', 'Jehu', 'Jeremiah', 'Jesus', 'Joel', 'John the Baptist', 'John of Patmos', 'Jonah', 'Joshua', 'Judas Barsabbas', 'Lucius', 'Malachi', 'Manahen', 'Micah', 'Micaiah', 'Miriam', 'Moses', 'Nahum', 'Nathan', 'Noah', 'Obadiah', 'Oded', 'Philip', 'Paul', 'Samuel', 'Shemaiah', 'Silas', 'Simeon', 'Urijah', 'Zechariah', 'Zephaniah']

    },


    {

        "Old Testament Books": ["Amos", "books of Moses", "Chronicles", "Daniel", "Deuteronomy", "Ecclesiastes", "Esther", "Exodus", "Ezekiel", "Ezra", "Genesis", "Habakkuk", "Haggai", "Hosea", "Isaiah", "Jeremiah", "Job", "Joel", "Jonah", "Joshua", "Judges", "Kings", "Lamentations", "law", "Leviticus", "Malachi", "Micah", "Nahum", "Nehemiah", "Numbers", "Obadiah", "Pentateuch", "prophets", "Proverbs", "Psalms", "Ruth", "Samuel", "Song of Solomon", "Torah", "Zechariah", "Zephaniah"]

    },


    {

        "Book of Mormon": ["abridgment", "Americas", "ancient prophets", "Angel Moroni", "Another Testament", "Alma", "Enos", "Ether", "Helaman", "Jacob", "Jarom", "Book of Mormon", "Book of Moroni", "Mosiah", "Book of Omni", "brass plates", "buried", "canon", "Eight Witnesses", "First Book of Nephi", "Fourth Nephi", "fulness", "Golden Plates", "hid up", "Hill Cumorah", "interpretation", "Jaredites", "Jesus Christ", "Jew and Gentile", "Joseph Smith", "keystone", "Lamanites", "Latter-day", "Mormon", "Moroni", "Nephites", "Palmyra", "plates", "Plates of Nephi", "prophet-historian", "published", "remnant", "sacred", "sealed up", "Second Book of Nephi", "Third Nephi", "Three Witnesses", "translated", "Urim and Thummim", "Words of Mormon", "Zarahemla"]

    },


    {

        "Kings of Judah & Israel": ["Abijah", "Abijam", "Ahab", "Ahaz", "Ahaziah", "Amaziah", "Amon", "Asa", "Athaliah", "Azariah", "Baasha", "Coniah", "David", "Elah", "Eliakim", "Hezekiah", "Hoshea", "Ishbosheth", "Jeconiah", "Jedidiah", "Jehoahaz", "Jehoash", "Jehoiachin", "Jehoiakim", "Jehoram", "Jehoshaphat", "Jehu", "Jeroboam", "Joash", "Joram", "Josiah", "Jotham", "Manasseh", "Menahem", "Nadab", "Omri", "Pekah", "Pekahiah", "Rehoboam", "Saul", "Shallum", "Solomon", "Uzziah", "Zachariah", "Zedekiah", "Zimri"]

    },


    {

        "Book of Mormon Prophets": ["Aaron", "Abinadi", "Abinadom", "Alma the Elder", "Alma the Younger", "Amaleki", "Amaron", "Ammaron", "Ammon", "Amos", "Amulek", "Chemish", "Disciples of Christ", "Enos", "Ether", "Helaman", "Himni", "Isaiah", "Jacob", "Jarom", "Jeremiah", "Jonas", "King Benjamin", "Kumen", "Kumenonhi", "Lehi", "Mahonri Moriancumer", "Mathoni", "Mathonihah", "Mormon", "Moroni", "Mosiah", "Nephi", "Omner", "Omni", "Samuel the Lamanite", "Shemnon", "Sons of Mosiah", "Timothy", "Zedekiah", "Zeezrom"]

    },


    {

        "Names of Christ": ["Advocate", "Almighty God", "Alpha and Omega", "Anointed One", "Author of Eternal Salvation", "Beginning and the Ending", "Beloved Son of God", "Blessed of God", "Bread of Life", "Bridegroom", "Bright and Morning Star", "Captain of Our Salvation", "Carpenter's Son", "Chief Cornerstone", "Chosen", "Christ Child", "Christ of God", "Christ the Lamb", "Comforter", "Consolation of Israel", "Cornerstone", "Counsellor", "Creator", "Deliverer", "Divine Son", "Emmanuel", "End of the Law", "Endless", "Eternal Father", "Eternal God", "Eternal Head", "Eternal Judge of Quick and Dead", "Everlasting Father", "Exemplar", "Faithful and True", "Father of Heaven and Earth", "Finisher of Faith", "First and the Last", "Firstborn", "Firstfruits", "God of Abraham", "God of Isaac", "God of Israel", "God of Jacob", "God of Thy Father", "God of Whole Earth", "God's Anointed", "God's Holy Child Jesus", "Good Shepherd", "Governor", "Great God", "Great I AM", "Great Shepherd", "Head of Every Man", "Head of the Body", "Head of the Church", "Healer", "Heir of All Things", "Holy Child", "Holy Messiah", "Holy One", "Holy One of Israel", "Holy One of Jacob", "I AM", "Image of God", "Immanuel", "Jehovah", "Jesus Christ", "Jesus of Galilee", "Jesus of Nazareth", "Joseph's Son", "Judge", "Judge of Quick and Dead", "Just One", "King", "King of Israel", "King of Kings", "King of the Jews", "King of Zion", "Lamb", "Lamb of God", "Light of the World", "Lion of the Tribe of Judah", "Living Bread", "Living Stone", "Living Water", "Lord from Heaven", "Lord God", "Lord God Almighty", "Lord God of Hosts", "Lord Jehovah", "Lord Jesus", "Lord of All", "Lord of Dead", "Lord of Glory", "Lord of Hosts", "Lord of Living", "Lord of Lords", "Lord of the Sabbath", "Lord Omnipotent", "Lord our Righteousness", "Lord's Christ", "Maker", "Man of Counsel", "Man of Holiness", "Master", "Mediator", "Meek and Lowly", "Messenger of the Covenant", "Messiah", "Messias", "Mighty God", "Mighty One", "Mighty One of Israel", "Mighty One of Jacob", "Minister", "Most High God", "Nazarene", "Offspring of David", "Only Begotten of the Father", "Only Begotten Son", "Our Passover", "Physician", "Power of God", "Prince", "Prince of Life", "Prince of Peace", "Prophet", "Prophet of Nazareth", "Propitiation for Sins of Whole World", "Rabbi", "Redeemer", "Redeemer of Israel", "Redeemer of the World", "Resurrection and the Life", "Revealer", "Righteous Judge", "Righteous Man", "Rock of Heaven", "Root of Jesse", "Savior", "Savior of Israel", "Savior of the World", "Second Comforter", "Seed of Abraham", "Seed of David", "Seed of the Woman", "Servant of Jehovah", "Servant of the Lord", "Shepherd", "Son of Abraham", "Son of David", "Son of God", "Son of Man", "Son of Mary", "Son of Righteousness", "Son of the Blessed", "Son of the Eternal Father", "Son of the Everlasting God", "Son of the Highest", "Son of the Living God", "Son of the Most High God", "Spiritual Rock", "Stem of Jesse", "Teacher Come from God", "The Amen", "The Just", "The Life", "The Light", "The Rock", "The Sacrifice", "The Truth", "The Way", "The Word", "True Vine", "Unchangeable One", "Well Beloved", "Wisdom of God", "Wonderful", "Word of Life"]

    },



    {

        '"Come Come Ye Saints"': ["'tis", "above", "afraid", "again", "air", "appear", "before", "better", "blessed", "cares", "chorus", "come", "courage", "die", "drive", "dwell", "earn", "far", "fear", "fight", "find", "forsake", "free", "fresh", "gird", "God", "grace", "great", "happy day", "hard", "hearts", "hurt", "journey", "joy", "just", "King", "labor", "lives", "loins", "lot", "make", "may", "mourn", "music", "never", "none", "nor", "now", "obtain", "our", "place", "praises", "prepared", "rest", "reward", "right", "ring", "Saints", "see", "shall", "shout", "shun", "soon", "sorrow", "spared", "strive", "swell", "take", "tale", "tell", "then", "think", "Though", "toil", "too", "useless", "way", "all is well", "wend", "west", "where", "why", "words"]

    },



    {

        "The Creation": ["animals", "be fruitful", "beast", "blessed", "created", "creature", "creeping thing", "darkness", "days", "deep", "divided", "dominion", "Earth", "evening", "female", "fifth", "firmament", "first", "fish of the sea", "fourth", "fowl of the air", "fruit tree", "fruitful", "gathered", "Genesis", "grass", "heavens", "herb", "in our image", "in the beginning", "it was good", "it was so", "land", "let there be", "lights", "living creature", "male", "Moon", "morning", "multiply", "night", "replenish", "rule", "seasons", "second", "seed is in itself", "signs", "Spirit of God", "stars", "subdue", "Sun", "third", "tree", "void", "waters", "whales", "winged", "without form", "years", "yielding"]

    },


    {

        "Modern Prophets": ["Albert", "Benson", "Brigham", "David", "Ezra", "Fielding", "First Presidency", "George", "Gordon", "Grant", "Harold", "Heber", "high priest", "Hinckley", "Howard", "Hunter", "John", "Joseph", "keys", "Kimball", "Lee", "Lorenzo", "McKay", "messenger", "Monson", "president", "prophet", "revelator", "sealing power", "seer", "Smith", "Snow", "Spencer", "Taft", "Taylor", "Thomas", "watchman", "Wilford", "Woodruff", "Young", "Russell", "Nelson"]

    },



    {

        "12 Apostles": ["Andersen", "apostles", "Ballard", "Bednar", "called", "Christofferson", "Cook", "counsel", "David", "Elder", "encouraging", "general authority", "governing", "Holland", "Jeffrey", "Jesus Christ", "leaders", "meeting", "members", "missionary", "Neil", "prophets", "Quentin", "quorum", "revelators", "seers", "special witness", "spiritual", "teach", "sustain", "testify", "Todd", "traveling", "Twelve", "worldwide", "Ronald", "Rasband", "Gary", "Stevenson", "Dale", "Renlund", "Dieter", "Uchtdorf"]

    },



    {

        "Sacrament": ["always", "Amen", "ask", "bless", "blood", "body", "bread", "Christ", "commandments", "drink", "eat", "Eternal", "Father", "given", "God", "hath", "Jesus", "keep", "may", "name", "partake", "remember", "remembrance", "sanctify", "shed", "Son", "souls", "Spirit", "take", "thee", "thy", "unto", "upon", "willing", "water", "witness", "priest", "elder", "kneel", "tray"]

    },



    {

        "Christ-like": ["atonement", "believing", "benevolent", "charity", "chaste", "empathy", "enduring", "faith", "forgiving", "glorious", "godliness", "good report", "goodness", "grace", "holiness", "honesty", "honorable", "hope", "humility", "joy", "justification", "kindness", "love", "lovely", "meek", "obedience", "patience", "peace", "persistent", "prayerful", "purity", "reconciliation", "redeemed", "repentant", "reverent", "righteousness", "salvation", "steadfast", "thanksgiving", "true", "virtue"]

    }



];
