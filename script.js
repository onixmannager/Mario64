document.addEventListener('DOMContentLoaded', () => {
    // Initialize WebSocket connection for multiplayer functionality
    const room = new WebsimSocket();
    
    // Setup favorite collection
    const favorites = room.collection('favorite');
    
    // Track if we're currently generating frames (to avoid conflicts)
    let isGeneratingFrames = false;

    // Toggle for Makeup Artist agent (enable by default)
    let useMakeupArtist = true;

    // Update theme options
    const themeOptions = document.querySelector('[name="theme"]').closest('.options-row');
    themeOptions.innerHTML = `
        <label><input type="checkbox" name="theme" value="Slice of Life"> Slice of Life</label>
        <label><input type="checkbox" name="theme" value="Romance"> Romance</label>
        <label><input type="checkbox" name="theme" value="Coming of Age"> Coming of Age</label>
        <label><input type="checkbox" name="theme" value="Revenge"> Revenge</label>
        <label><input type="checkbox" name="theme" value="Psychological"> Psychological</label>
        <label><input type="checkbox" name="theme" value="Light Hearted"> Light Hearted</label>
        <label><input type="checkbox" name="theme" value="Family"> Family</label>
    `;

    // Update visual style options to include Anime
    const styleOptions = document.querySelector('[name="style"]').closest('.options-row');
    styleOptions.innerHTML = `
        <label><input type="radio" name="style" value="Vibrant and energetic with rich color palettes"> Vibrant</label>
        <label><input type="radio" name="style" value="Dark and gritty with high contrast cinematography"> Dark & Gritty</label>
        <label><input type="radio" name="style" value="Stylized animation with distinctive artistic direction"> Animation</label>
        <label><input type="radio" name="style" value="Japanese anime style with distinctive visual flair"> Anime</label>
        <label><input type="radio" name="style" value="Raw documentary style with natural lighting"> Documentary</label>
        <label><input type="radio" name="style" value="Dreamlike and surreal visuals with ethereal qualities"> Surreal</label>
        <label><input type="radio" name="style" value="Classic Hollywood glamour with polished aesthetics"> Classic</label>
    `;

    // Update setting options
    const settingOptions = document.querySelector('[name="setting"]').closest('.options-row');
    settingOptions.innerHTML = `
        <label><input type="radio" name="setting" value="Modern"> Modern</label>
        <label><input type="radio" name="setting" value="Futuristic World"> Futuristic</label>
        <label><input type="radio" name="setting" value="Medieval Fantasy"> Medieval</label>
        <label><input type="radio" name="setting" value="Post-Apocalyptic"> Post-Apocalyptic</label>
        <label><input type="radio" name="setting" value="Historical Period"> Historical</label>
    `;

    // Add art style options
    const artStyleGroup = document.createElement('div');
    artStyleGroup.className = 'options-group';
    artStyleGroup.innerHTML = `
        <div class="options-title">Art Style:</div>
        <div class="options-row">
            <label><input type="radio" name="artStyle" value="Detailed and realistic with high-fidelity textures"> Detailed</label>
            <label><input type="radio" name="artStyle" value="Minimalist and clean with simplified forms"> Minimalist</label>
            <label><input type="radio" name="artStyle" value="Stylized and exaggerated with unique aesthetics"> Stylized</label>
            <label><input type="radio" name="artStyle" value="Atmospheric and moody with strong environmental presence"> Atmospheric</label>
            <label><input type="radio" name="artStyle" value="Avant-garde and experimental with unconventional techniques"> Experimental</label>
        </div>
    `;
    document.querySelector('.options-column:first-child').appendChild(artStyleGroup);

    // Initial sample movies
    const initialMovies = [
        {
            title: "Quantum Echo",
            year: 2024,
            director: "Elena Katsopolis",
            stars: "David Chen, Ana Rodriguez, Julian Harper",
            runtime: "2h 14m",
            rating: "R",
            description: "In a near future where quantum computing enables time echoes, a physicist discovers that fragments of past realities are bleeding into the present, threatening to unravel the fabric of existence itself.",
            reviews: [
                { source: "The Virtual Times", text: "A mind-bending tour de force that challenges both physics and philosophy." },
                { source: "Future Frame Magazine", text: "Katsopolis crafts an intricate puzzle that rewards multiple viewings." }
            ],
            poster: generateColorfulGradient(),
            username: "system" // Example movie "owned" by 'system'
        },
        {
            title: "The Last Lighthouse",
            year: 2023,
            director: "Marcus Thorn",
            stars: "Olivia Pearson, Samuel Jackson, Lena Kim",
            runtime: "2h 37m",
            rating: "PG-13",
            description: "On a remote island that exists at the edge of reality, the last lighthouse keeper maintains the ancient beacon that prevents dark forces from entering our world. When the light begins to fade, humanity's last hope rests with an unlikely hero.",
            reviews: [
                { source: "Cinematic Horizons", text: "A breathtaking visual journey that combines folk horror with high concept fantasy." },
                { source: "The Film Observer", text: "Thorn's direction creates a sense of dread and wonder that haunts you long after viewing." }
            ],
            poster: generateColorfulGradient(),
            username: "system"
        },
        {
            title: "Skyborn",
            year: 2024,
            director: "Aisha Washington",
            stars: "Michael B. Jordan, Zendaya, Daniel Wu",
            runtime: "2h 8m",
            rating: "PG-13",
            description: "When massive floating cities appear in the skies over major population centers, a team of scientists and military specialists must uncover their origins before humanity is forever changed by what they contain.",
            reviews: [
                { source: "Science Fiction Today", text: "A spectacular first contact story with heart and intelligence to match its stunning visuals." },
                { source: "New World Cinema", text: "Washington deftly balances awe-inspiring spectacle with intimate human drama." }
            ],
            poster: generateColorfulGradient(),
            username: "system"
        },
        {
            title: "Midnight Carousel",
            year: 2023,
            director: "Jean-Pierre Devereaux",
            stars: "Isabelle Laurent, Thomas Reid, Sofia Vergara",
            runtime: "1h 58m",
            rating: "R",
            description: "In 1920s Paris, a mysterious carousel appears at midnight in the heart of Montmartre, offering riders a chance to relive their deepest regrets. As the boundaries between past and present blur, a young artist becomes obsessed with its powers.",
            reviews: [
                { source: "Parisian Arts Review", text: "A sumptuous feast for the senses that channels the spirit of magical realism." },
                { source: "Midnight Cinema Club", text: "Devereaux crafts a haunting meditation on regret that feels like a half-remembered dream." }
            ],
            poster: generateColorfulGradient(),
            username: "system"
        },
        {
            title: "The Algorithm",
            year: 2024,
            director: "Seo-Jun Park",
            stars: "Emma Stone, Dev Patel, Keanu Reeves",
            runtime: "2h 22m",
            rating: "PG-13",
            description: "When a reclusive programmer creates an AI that can predict how any choice will alter the future, she becomes the target of powerful interests who want to control destiny itself.",
            reviews: [
                { source: "Tech Thriller Review", text: "A nail-biting techno-thriller that asks profound questions about free will." },
                { source: "Future Watch", text: "Park's direction turns complex concepts into edge-of-your-seat entertainment." }
            ],
            poster: generateColorfulGradient(),
            username: "system"
        },
        {
            title: "Whispers in the Frost",
            year: 2023,
            director: "Nikolai Volkov",
            stars: "Florence Pugh, Oscar Isaac, Stellan Skarsgård",
            runtime: "2h 45m",
            rating: "R",
            description: "During an Arctic expedition in the 1930s, a team of researchers discovers an ancient civilization preserved in ice. As they thaw their findings, they unwittingly release something that has been waiting, watching, and learning for millennia.",
            reviews: [
                { source: "Horror Aficionado", text: "A masterclass in slow-burn tension that evolves into existential terror." },
                { source: "Frozen Frame", text: "Volkov uses the stark Arctic landscape to create a sense of isolation that becomes increasingly suffocating." }
            ],
            poster: generateColorfulGradient(),
            username: "system"
        }
    ];

    // Render initial movies
    renderMovies(initialMovies);

    // Set up accordion functionality (if any left in the code)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const arrow = header.querySelector('.accordion-arrow');
            
            content.classList.toggle('open');
            arrow.classList.toggle('open');
        });
    });

    // Set up event listeners
    document.getElementById('movie-grid').addEventListener('click', (e) => {
        const movieCard = e.target.closest('.movie-card');
        if (movieCard) {
            const movieIndex = parseInt(movieCard.dataset.index);
            showMovieDetailsPage(initialMovies[movieIndex]);
        }
    });

    // Back button to return to movie list
    document.getElementById('back-to-list').addEventListener('click', () => {
        hideMovieDetailsPage();
    });

    document.getElementById('generate-button').addEventListener('click', generateMovie);

    // Set up tab switching in movie details
    document.getElementById('reviews-tab').addEventListener('click', function() {
        switchTab('reviews');
    });
    
    document.getElementById('production-tab').addEventListener('click', function() {
        switchTab('production');
    });
    
    function switchTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Deactivate all tabs
        document.querySelectorAll('.tab-button').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content and activate tab
        document.getElementById(`${tabName}-content`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
    }

    // Film Production Model - Agent Hierarchy
    const filmProductionModel = {
        // The main agents in our film production model
        agents: {
            producer: {
                name: "Producer",
                role: "Evaluates the concept's commercial viability and budget requirements",
                process: async function(concept) {
                    try {
                        const completion = await websim.chat.completions.create({
                            messages: [
                                {
                                    role: "system",
                                    content: `You are an experienced film producer who evaluates movie concepts for commercial potential. 
                                    Analyze this movie concept and provide your production notes on budget size (small/medium/large/blockbuster), 
                                    target audience, commercial viability, and suggested production approach.
                                    Keep your response concise (100 words max).`
                                },
                                {
                                    role: "user",
                                    content: `Movie concept: ${concept}`
                                }
                            ]
                        });
                        return {
                            role: "Producer",
                            notes: completion.content
                        };
                    } catch (error) {
                        console.error("Producer agent error:", error);
                        return {
                            role: "Producer",
                            notes: "Commercial analysis unavailable due to technical difficulties."
                        };
                    }
                }
            },
            
            screenwriter: {
                name: "Screenwriter",
                role: "Develops story, characters, and narrative structure",
                process: async function(concept, producerNotes) {
                    try {
                        const completion = await websim.chat.completions.create({
                            messages: [
                                {
                                    role: "system",
                                    content: `You are a talented screenwriter who can turn concepts into compelling movie narratives.
                                    Based on this concept and the producer's notes, outline the key story elements: main characters, 
                                    plot arc, setting, conflict, and thematic elements.
                                    Keep your response concise (150 words max).`
                                },
                                {
                                    role: "user",
                                    content: `Movie concept: ${concept}\n\nProducer's notes: ${producerNotes}`
                                }
                            ]
                        });
                        return {
                            role: "Screenwriter",
                            notes: completion.content
                        };
                    } catch (error) {
                        console.error("Screenwriter agent error:", error);
                        return {
                            role: "Screenwriter",
                            notes: "Screenplay development unavailable due to technical difficulties."
                        };
                    }
                }
            },
            
            director: {
                name: "Director",
                role: "Provides creative vision and makes final decisions",
                process: async function(concept, producerNotes, screenwriterNotes) {
                    try {
                        const completion = await websim.chat.completions.create({
                            messages: [
                                {
                                    role: "system",
                                    content: `You are a visionary film director who brings concepts to life.
                                    Based on this concept, the producer's commercial notes, and the screenwriter's narrative, 
                                    provide your creative vision: visual style, tone, pacing, key scenes, and potential cast choices.
                                    Keep your response concise (150 words max).`
                                },
                                {
                                    role: "user",
                                    content: `Movie concept: ${concept}\n\nProducer's notes: ${producerNotes}\n\nScreenwriter's notes: ${screenwriterNotes}`
                                }
                            ]
                        });
                        return {
                            role: "Director",
                            notes: completion.content
                        };
                    } catch (error) {
                        console.error("Director agent error:", error);
                        return {
                            role: "Director",
                            notes: "Director's vision unavailable due to technical difficulties."
                        };
                    }
                }
            },

            // New Makeup Artist agent
            makeupArtist: {
                name: "Makeup Artist",
                role: "Produces short JSON describing main recurring characters' appearances",
                process: async function(concept, producerNotes, screenwriterNotes, directorNotes) {
                    try {
                        const completion = await websim.chat.completions.create({
                            messages: [
                                {
                                    role: "system",
                                    content: `
You are a "Makeup Artist" tasked with analyzing the movie concept, producer notes, screenwriter notes, and director notes to identify main or recurring characters. Provide a short JSON array describing each character by name and a short prompt describing their appearance (focusing on facial features, hair, etc.). Respond with JSON only, in the format:

[
  {
    "name": "String name (short, e.g. Bob)",
    "appearance": "Short prompt describing their look, e.g. 'Bob is tall with short brown hair, green eyes, and a friendly face.'"
  }
]

Only 2-4 characters max. If none found, return an empty array.
`
                                },
                                {
                                    role: "user",
                                    content: `Concept: ${concept}\nProducer notes: ${producerNotes}\nScreenwriter notes: ${screenwriterNotes}\nDirector notes: ${directorNotes}`
                                }
                            ],
                            json: true
                        });
                        return JSON.parse(completion.content);
                    } catch (err) {
                        console.error("Makeup artist agent error:", err);
                        return [];
                    }
                }
            }
        },
        
        // Process a concept through all agents in the hierarchy
        runProduction: async function(concept) {
            // Step 1: Producer evaluates the concept
            const producerOutput = await this.agents.producer.process(concept);
            
            // Step 2: Screenwriter develops the story based on concept and producer notes
            const screenwriterOutput = await this.agents.screenwriter.process(concept, producerOutput.notes);
            
            // Step 3: Director provides creative vision based on all inputs
            const directorOutput = await this.agents.director.process(
                concept, 
                producerOutput.notes, 
                screenwriterOutput.notes
            );

            // Step 4: Makeup Artist finds recurring characters
            const makeupArtistOutput = await this.agents.makeupArtist.process(
                concept,
                producerOutput.notes,
                screenwriterOutput.notes,
                directorOutput.notes
            );
            
            // Return all production notes
            return {
                concept,
                productionNotes: [
                    producerOutput,
                    screenwriterOutput,
                    directorOutput
                ],
                makeupArtistData: makeupArtistOutput
            };
        },
        
        // Convert production notes into a final movie object for display
        finalizeMovie: async function(productionData) {
            const movieDetails = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Create a complete movie profile based on the production team's vision.
                        Write a detailed 5-8 sentence synopsis that thoroughly covers the main plot, character arcs, 
                        themes, and emotional journey. Make it captivating and comprehensive enough to give readers 
                        a clear understanding of the movie's narrative and appeal.
                        Respond directly with JSON, following this JSON schema, and no other text:
                        {
                          title: string,
                          year: number (current or next year),
                          director: string,
                          stars: string,
                          runtime: string,
                          rating: string,
                          description: string,
                          reviews: [
                            { source: string, text: string },
                            { source: string, text: string }
                          ]
                        }`
                    },
                    {
                        role: "user",
                        content: `Concept: ${productionData.concept}
                        Producer notes: ${productionData.productionNotes[0].notes}
                        Screenwriter notes: ${productionData.productionNotes[1].notes}
                        Director notes: ${productionData.productionNotes[2].notes}`
                    }
                ],
                json: true
            });

            const result = JSON.parse(movieDetails.content);

            // Extract genres and add rating score
            const genreExtraction = await extractGenres(
                result.description + ' ' + 
                productionData.productionNotes.map(note => note.notes).join(' ')
            );
            
            result.genres = genreExtraction.genres;
            result.ratingScore = genreExtraction.rating;
            
            // Also store the makeup artist data
            result.makeupArtistData = productionData.makeupArtistData;

            return result;
        }
    };

    let moviePromptOptions = {};

    async function isNSFW(prompt) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `You are a content filter. Check if the movie concept contains NSFW themes. 
                        Respond with JSON only, following this schema:
                        { "isNSFW": boolean }`
                    },
                    {
                        role: "user", 
                        content: prompt
                    }
                ],
                json: true
            });
            return JSON.parse(completion.content).isNSFW;
        } catch (error) {
            console.error('NSFW check failed:', error);
            return false; // Default to false if check fails
        }
    }

    const detailHeaderInfo = document.querySelector('.detail-header-info');
    detailHeaderInfo.insertAdjacentHTML('beforeend', `
        <div class="detail-actions">
            <button id="regenerate-button" class="detail-action-button">
                <span class="action-icon">🔄</span> Regenerate
            </button>
            <button id="delete-button" class="detail-action-button warning">
                <span class="action-icon">🗑️</span> Delete
            </button>
            <button id="save-button" class="detail-action-button">
                <span class="action-icon">💾</span> Save
            </button>
            <button id="publish-button" class="detail-action-button primary">
                <span class="action-icon">🌐</span> Publish
            </button>
        </div>
    `);

    async function generateMovie() {
        const generateButton = document.getElementById('generate-button');
        if (generateButton.disabled) {
            return;
        }

        const prompt = document.getElementById('movie-prompt').value.trim();
        if (!prompt) {
            alert('Please enter a movie concept!');
            return;
        }

        // Store current options
        moviePromptOptions = {
            genres: Array.from(document.querySelectorAll('input[name="genre"]:checked'))
                .map(checkbox => checkbox.value),
            themes: Array.from(document.querySelectorAll('input[name="theme"]:checked'))
                .map(checkbox => checkbox.value),
            audiences: Array.from(document.querySelectorAll('input[name="audience"]:checked'))
                .map(checkbox => checkbox.value),
            style: Array.from(document.querySelectorAll('input[name="style"]:checked'))
                .map(radio => radio.value),
            artStyle: Array.from(document.querySelectorAll('input[name="artStyle"]:checked'))
                .map(radio => radio.value)[0],
            setting: Array.from(document.querySelectorAll('input[name="setting"]:checked'))
                .map(radio => radio.value),
            length: Array.from(document.querySelectorAll('input[name="length"]:checked'))
                .map(radio => radio.value)[0],
            prompt: prompt
        };

        // Check for NSFW content
        const isNSFWContent = await isNSFW(prompt);

        // Disable button and show loading
        generateButton.disabled = true;
        generateButton.textContent = 'Creating...';
        generateButton.classList.add('generating');
        document.getElementById('loading-indicator').style.display = 'flex';

        try {
            // Run the concept through our film production model
            const productionData = await filmProductionModel.runProduction(prompt);

            // Convert production data into a movie object
            const movieDetails = await filmProductionModel.finalizeMovie(productionData);

            // Generate a poster image for the movie
            const posterUrl = await generateMoviePoster(movieDetails.title, movieDetails.description);
            movieDetails.poster = posterUrl;

            // Add production notes + makeup data to the movie object
            movieDetails.productionNotes = productionData.productionNotes;
            movieDetails.makeupArtistData = productionData.makeupArtistData;

            // Generate rating score (more varied)
            movieDetails.ratingScore = (Math.random() * 2.4 + 2.6).toFixed(1); // Random score between 2.6 and 5.0

            // Add NSFW flag and options to movie object
            movieDetails.isNSFW = isNSFWContent;
            movieDetails.promptOptions = moviePromptOptions;
            movieDetails.saved = false;
            movieDetails.wasEdited = false;
            // Set a default username for newly generated movies (simulate "current user")
            movieDetails.username = room.party.client.username || "anonymous";
            // By default enable makeup artist usage
            movieDetails.useMakeupArtist = useMakeupArtist;

            // Re-render the movie grid
            initialMovies.unshift(movieDetails);
            renderMovies(initialMovies);

            // Show the details of the generated movie
            showMovieDetailsPage(movieDetails);
        } catch (error) {
            console.error('Failed to generate movie:', error);
            alert('Sorry, there was an error creating your movie. Please try again.');
        } finally {
            // Re-enable button and hide loading
            generateButton.disabled = false;
            generateButton.textContent = 'Generate Movie';
            generateButton.classList.remove('generating');
            document.getElementById('loading-indicator').style.display = 'none';
        }
    }

    function renderMovies(movies) {
        const movieGrid = document.getElementById('movie-grid');
        movieGrid.innerHTML = '';
        
        movies.forEach((movie, index) => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card';
            if (!movie.saved) {
                movieCard.classList.add('unsaved');
            }
            movieCard.dataset.index = index;
            
            const posterStyle = movie.poster.startsWith('http') 
                ? `background-image: url(${movie.poster})` 
                : movie.poster;
            
            movieCard.innerHTML = `
                <div class="poster" style="${posterStyle}"></div>
                <div class="card-content">
                    <div class="card-title">${movie.title}</div>
                    <div class="card-year">${movie.year}</div>
                    ${!movie.saved ? '<div class="unsaved-indicator">Unsaved</div>' : ''}
                </div>
            `;
            
            movieGrid.appendChild(movieCard);
        });
        setupFavorites();
    }

    async function publishMovie() {
        if (!currentMovie) return;
        
        const publishButton = document.getElementById('publish-button');
        
        // Prevent publishing if not the owner
        if (currentMovie.username !== room.party.client.username) {
            alert("You cannot publish this movie because it isn't yours.");
            return;
        }

        if (currentMovie.isNSFW) {
            publishButton.disabled = true;
            publishButton.title = "This movie contains NSFW content and cannot be published";
            return;
        }

        publishButton.disabled = true;
        publishButton.textContent = "Publishing...";
        
        try {
            let publishedMovie;
            if (currentMovie.id) {
                // Update existing movie
                publishedMovie = await room.collection('movie').update(currentMovie.id, {
                    ...currentMovie,
                    saved: true
                });
            } else {
                // Create new movie
                publishedMovie = await room.collection('movie').create({
                    ...currentMovie,
                    saved: true
                });
            }
            
            // Update the local movie to reflect it's been published
            const index = initialMovies.findIndex(m => m.title === currentMovie.title);
            if (index !== -1) {
                initialMovies[index].id = publishedMovie.id;
                initialMovies[index].saved = true;
                renderMovies(initialMovies);
                
                // Update currentMovie
                currentMovie.id = publishedMovie.id;
                currentMovie.saved = true;
            }
            
            publishButton.textContent = "Published!";
            publishButton.classList.add('success');
            
            // Switch to all movies tab
            switchListTab('all-movies');
            
            setTimeout(() => {
                publishButton.textContent = "Publish";
                publishButton.classList.remove('success');
                publishButton.style.display = 'none';
            }, 2000);
            currentMovie.wasEdited = false; // Reset edit flag
        } catch (error) {
            console.error('Failed to publish movie:', error);
            alert('Failed to publish movie. Please try again.');
            publishButton.textContent = "Publish";
            publishButton.disabled = false;
        }
    }

    function saveMovieLocally() {
        if (!currentMovie) return;
        
        currentMovie.saved = true;
        currentMovie.wasEdited = false; // Reset edit flag
        
        // Find and update movie in initialMovies
        const index = initialMovies.findIndex(m => m.title === currentMovie.title);
        if (index !== -1) {
            initialMovies[index] = currentMovie;
            renderMovies(initialMovies);
        }
        
        // Show feedback
        const saveButton = document.getElementById('save-button');
        const originalText = saveButton.textContent;
        saveButton.textContent = "Saved!";
        saveButton.classList.add('success');
        
        setTimeout(() => {
            saveButton.textContent = originalText;
            saveButton.classList.remove('success');
            saveButton.style.display = 'none';
        }, 2000);
    }

    document.getElementById('regenerate-button').addEventListener('click', () => {
        if (!currentMovie || !currentMovie.promptOptions) return;
        
        // Set all options based on stored values
        const options = currentMovie.promptOptions;
        
        // Set prompt
        document.getElementById('movie-prompt').value = options.prompt || '';
        
        // Clear existing checks
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        document.querySelectorAll('input[type="radio"]').forEach(radio => {
            radio.checked = false;
        });
        
        // Check appropriate options
        if (options.genres) {
            options.genres.forEach(genre => {
                const checkbox = document.querySelector(`input[name="genre"][value="${genre}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        if (options.themes) {
            options.themes.forEach(theme => {
                const checkbox = document.querySelector(`input[name="theme"][value="${theme}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        if (options.audiences) {
            options.audiences.forEach(audience => {
                const checkbox = document.querySelector(`input[name="audience"][value="${audience}"]`);
                if (checkbox) checkbox.checked = true;
            });
        }
        
        if (options.style) {
            options.style.forEach(style => {
                const radio = document.querySelector(`input[name="style"][value="${style}"]`);
                if (radio) radio.checked = true;
            });
        }
        
        if (options.artStyle) {
            const artStyleValue = Array.isArray(options.artStyle) ? options.artStyle[0] : options.artStyle;
            const radio = document.querySelector(`input[name="artStyle"][value="${artStyleValue}"]`);
            if (radio) radio.checked = true;
        }
        
        if (options.setting) {
            options.setting.forEach(setting => {
                const radio = document.querySelector(`input[name="setting"][value="${setting}"]`);
                if (radio) radio.checked = true;
            });
        }
        
        if (options.length) {
            const lengthValue = Array.isArray(options.length) ? options.length[0] : options.length;
            const radio = document.querySelector(`input[name="length"][value="${lengthValue}"]`);
            if (radio) radio.checked = true;
        }
        
        // Hide details and scroll to generator
        hideMovieDetailsPage();
        document.getElementById('generate-section').scrollIntoView({ behavior: 'smooth' });
    });

    document.getElementById('delete-button').addEventListener('click', () => {
        if (!currentMovie) return;
        
        if (confirm('Are you sure you want to delete this movie?')) {
            const index = initialMovies.findIndex(m => m.title === currentMovie.title);
            if (index !== -1) {
                initialMovies.splice(index, 1);
                renderMovies(initialMovies);
                hideMovieDetailsPage();
            }
        }
    });

    document.getElementById('save-button').addEventListener('click', saveMovieLocally);

    document.getElementById('publish-button').addEventListener('click', publishMovie);

    function showMovieDetailsPage(movie) {
        // Store current movie
        currentMovie = movie;
        
        // Show the details page and hide list/generator
        document.getElementById('movie-details-view').classList.add('active');
        document.getElementById('movie-list-view').classList.add('hidden');
        document.getElementById('generate-section').style.display = 'none';
        
        // Populate the details
        const titleElement = document.getElementById('detail-title');
        const descriptionElement = document.getElementById('detail-description');

        titleElement.textContent = movie.title;
        document.getElementById('detail-year').textContent = movie.year;
        document.getElementById('detail-runtime').textContent = movie.runtime;
        document.getElementById('detail-rating').textContent = movie.rating;
        document.getElementById('detail-director').textContent = movie.director;
        document.getElementById('detail-stars').textContent = movie.stars;
        descriptionElement.textContent = movie.description;
        
        // Make the title content editable in edit mode
        titleElement.contentEditable = false;

        // Generate or display rating
        const ratingScore = movie.ratingScore || (Math.random() * 2.4 + 2.6).toFixed(1); // Between 2.6 and 5.0
        document.getElementById('rating-value').textContent = ratingScore;
        
        // Generate star rating
        const starRating = document.getElementById('star-rating');
        starRating.innerHTML = '';
        const fullStars = Math.floor(ratingScore);
        const hasHalfStar = ratingScore - fullStars >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            const star = document.createElement('span');
            star.className = 'star';
            if (i < fullStars) {
                star.innerHTML = '★'; // Full star
            } else if (i === fullStars && hasHalfStar) {
                star.innerHTML = '★'; // Half star
                star.style.opacity = '0.5';
            } else {
                star.innerHTML = '☆'; // Empty star
            }
            starRating.appendChild(star);
        }
        
        // Display genres if available
        const genresElement = document.getElementById('detail-genres');
        genresElement.innerHTML = '';
        
        if (movie.genres && movie.genres.length > 0) {
            movie.genres.forEach(genre => {
                const genreTag = document.createElement('span');
                genreTag.className = 'genre-tag';
                genreTag.textContent = genre;
                genresElement.appendChild(genreTag);
            });
        }
        
        const detailPoster = document.getElementById('detail-poster');
        if (movie.poster.startsWith('http')) {
            detailPoster.style.backgroundImage = `url(${movie.poster})`;
        } else {
            detailPoster.style = movie.poster;
        }
        
        const reviewsElement = document.getElementById('detail-reviews');
        reviewsElement.innerHTML = '';
        
        movie.reviews.forEach(review => {
            const reviewElement = document.createElement('div');
            reviewElement.className = 'review';
            reviewElement.innerHTML = `
                <div class="review-source">${review.source}</div>
                <div class="review-text">"${review.text}"</div>
            `;
            reviewsElement.appendChild(reviewElement);
        });
        
        // Add production notes if available
        if (movie.productionNotes) {
            const productionNotesElement = document.getElementById('production-notes-content');
            productionNotesElement.innerHTML = '';
            
            movie.productionNotes.forEach(note => {
                const noteElement = document.createElement('div');
                noteElement.className = 'production-note';
                noteElement.innerHTML = `
                    <div class="note-role">${note.role}</div>
                    <div class="note-content">${note.notes}</div>
                `;
                productionNotesElement.appendChild(noteElement);
            });
        }
        
        // Set reviews tab as active by default
        switchTab('reviews');
        
        // Generate user comments
        generateUserComments(movie).then(comments => {
            const commentsContainer = document.getElementById('user-comments');
            commentsContainer.innerHTML = '';
            
            comments.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comment';
                
                // Create stars for user rating
                let starsHtml = '';
                for (let i = 0; i < 5; i++) {
                    if (i < Math.floor(comment.rating)) {
                        starsHtml += '<span class="star">★</span>';
                    } else if (i === Math.floor(comment.rating) && comment.rating % 1 >= 0.5) {
                        starsHtml += '<span class="star half">★</span>';
                    } else {
                        starsHtml += '<span class="star">☆</span>';
                    }
                }
                
                commentElement.innerHTML = `
                    <div class="comment-header">
                        <div class="comment-user-info">
                            <div class="comment-user">${comment.user}</div>
                            <div class="comment-date">${comment.date}</div>
                            ${comment.persona ? `<div class="comment-persona">${comment.persona}</div>` : ''}
                        </div>
                        <div class="comment-rating">
                            ${starsHtml}
                            <span class="comment-rating-number">${comment.rating}</span>
                        </div>
                    </div>
                    <div class="comment-text">${comment.text}</div>
                    <div class="comment-footer">
                        <div class="comment-likes">
                            <span class="like-icon">❤</span> ${comment.likes}
                        </div>
                    </div>
                `;
                commentsContainer.appendChild(commentElement);
            });
        });
        
        // Remove duplication of edit button if it already exists, then add
        const detailActions = document.querySelector('.detail-actions');
        let existingEditButton = detailActions.querySelector('#edit-button');
        if (existingEditButton) {
            existingEditButton.remove();
        }

        const editButton = document.createElement('button');
        editButton.id = 'edit-button';
        editButton.className = 'detail-action-button';
        editButton.innerHTML = '<span class="action-icon">✏️</span> Edit';
        detailActions.insertBefore(editButton, detailActions.firstChild);

        // Show/hide delete button if user doesn't own this movie
        const deleteButton = document.getElementById('delete-button');
        if (deleteButton) {
            if (movie.username !== room.party.client.username) {
                deleteButton.style.display = 'none';
            } else {
                deleteButton.style.display = 'inline-block';
            }
        }

        // Handle edit mode
        let isEditing = false;
        editButton.addEventListener('click', () => {
            isEditing = !isEditing;
            document.getElementById('movie-details').classList.toggle('edit-mode', isEditing);
            editButton.innerHTML = isEditing ? 
                '<span class="action-icon">✓</span> Done' : 
                '<span class="action-icon">✏️</span> Edit';

            // Make the title editable
            titleElement.contentEditable = isEditing;
            if (isEditing) {
                // Listen to input changes on the title
                titleElement.addEventListener('input', onTitleEdited);
            } else {
                titleElement.removeEventListener('input', onTitleEdited);
            }

            if (!isEditing) {
                // If changes were made, enable save/publish buttons
                if (currentMovie.wasEdited) {
                    const saveButton = document.getElementById('save-button');
                    const publishButton = document.getElementById('publish-button');
                    if (saveButton) saveButton.style.display = 'flex';
                    if (publishButton && !currentMovie.isNSFW && currentMovie.username === room.party.client.username) {
                        publishButton.style.display = 'flex';
                    }
                }
            }
        });

        function onTitleEdited() {
            currentMovie.title = titleElement.textContent;
            currentMovie.wasEdited = true;
        }
        
        // Add small regenerate buttons for Title and Description
        titleElement.className = 'editable';
        descriptionElement.className = 'editable';
        
        // Insert small regenerate button if not present
        if (!titleElement.querySelector('.regenerate-button')) {
            titleElement.innerHTML += '<button class="regenerate-button">🔄</button>';
        }
        if (!descriptionElement.querySelector('.regenerate-button')) {
            descriptionElement.innerHTML += '<button class="regenerate-button">🔄</button>';
        }

        // Handle regeneration for Title
        const titleRegenButton = titleElement.querySelector('.regenerate-button');
        if (titleRegenButton) {
            titleRegenButton.addEventListener('click', async () => {
                if (!isEditing) return;
                titleRegenButton.disabled = true;
                titleElement.classList.add('awaiting-generation');
                let timedOut = false;
                const regenerationTimeout = setTimeout(() => {
                    timedOut = true;
                }, 8000);

                try {
                    const completionPromise = websim.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: "Generate a creative and engaging movie title for this concept. Return only the title, no other text."
                            },
                            {
                                role: "user",
                                content: `Current movie: ${currentMovie.description}`
                            }
                        ]
                    });

                    const result = await Promise.race([
                        completionPromise,
                        new Promise((_, reject) => {
                            setTimeout(() => {
                                if (!timedOut) return;
                                reject(new Error("Regeneration timed out"));
                            }, 8500);
                        })
                    ]);

                    titleElement.textContent = result.content;
                    currentMovie.title = result.content;
                    currentMovie.wasEdited = true;
                } catch (error) {
                    console.error('Failed to regenerate title:', error);
                    alert("Regeneration failed or took too long. Please try again.");
                } finally {
                    clearTimeout(regenerationTimeout);
                    titleRegenButton.disabled = false;
                    titleElement.classList.remove('awaiting-generation');
                    // Re-append the button
                    if (!titleElement.querySelector('.regenerate-button')) {
                        titleElement.innerHTML += '<button class="regenerate-button">🔄</button>';
                    }
                }
            });
        }

        // Handle regeneration for Description
        const descriptionRegenButton = descriptionElement.querySelector('.regenerate-button');
        if (descriptionRegenButton) {
            descriptionRegenButton.addEventListener('click', async () => {
                if (!isEditing) return;
                descriptionRegenButton.disabled = true;
                descriptionElement.classList.add('awaiting-generation');
                let timedOut = false;
                const regenerationTimeout = setTimeout(() => {
                    timedOut = true;
                }, 8000);

                try {
                    const completionPromise = websim.chat.completions.create({
                        messages: [
                            {
                                role: "system",
                                content: "Write a detailed 3-4 sentence movie synopsis that captures the main plot, characters, and themes. Keep it engaging but concise."
                            },
                            {
                                role: "user",
                                content: `Movie title: ${currentMovie.title}\nCurrent themes and genres: ${currentMovie.genres ? currentMovie.genres.join(', ') : 'Unspecified'}`
                            }
                        ]
                    });

                    const result = await Promise.race([
                        completionPromise,
                        new Promise((_, reject) => {
                            setTimeout(() => {
                                if (!timedOut) return;
                                reject(new Error("Regeneration timed out"));
                            }, 8500);
                        })
                    ]);

                    descriptionElement.textContent = result.content;
                    currentMovie.description = result.content;
                    currentMovie.wasEdited = true;
                } catch (error) {
                    console.error('Failed to regenerate description:', error);
                    alert("Regeneration failed or took too long. Please try again.");
                } finally {
                    clearTimeout(regenerationTimeout);
                    descriptionRegenButton.disabled = false;
                    descriptionElement.classList.remove('awaiting-generation');
                    // Re-append the button
                    if (!descriptionElement.querySelector('.regenerate-button')) {
                        descriptionElement.innerHTML += '<button class="regenerate-button">🔄</button>';
                    }
                }
            });
        }

        // Handle button visibility based on movie state
        const saveButton = document.getElementById('save-button');
        const publishButton = document.getElementById('publish-button');
        
        // Check if movie is saved
        if (movie.saved) {
            saveButton.style.display = 'none';
        } else {
            saveButton.style.display = 'flex';
        }
        
        // Check if movie is published or NSFW
        if (movie.id) {
            // Already published
            publishButton.style.display = 'none';
        } else {
            // If user is not the owner, or movie is NSFW, disable or hide
            if (movie.username !== room.party.client.username) {
                publishButton.style.display = 'none';
            } else {
                publishButton.style.display = 'flex';
                if (movie.isNSFW) {
                    publishButton.disabled = true;
                    publishButton.title = "This movie contains NSFW content and cannot be published";
                } else {
                    publishButton.disabled = false;
                    publishButton.title = "";
                }
            }
        }
        
        // Scroll to the details view
        document.getElementById('movie-details-view').scrollIntoView({ behavior: 'smooth' });
        
        // Remove the existing watch button if present
        const existingWatchButton = document.getElementById('watch-button');
        if (existingWatchButton) {
            existingWatchButton.remove();
        }
        
        // Add the video player button below the poster
        const posterContainer = document.querySelector('.detail-poster-container');
        const watchButton = document.createElement('button');
        watchButton.id = 'watch-button';
        watchButton.className = 'watch-preview-button';
        watchButton.innerHTML = '<span class="play-icon">▶</span> Watch Preview';
        posterContainer.appendChild(watchButton);
        
        // Handle watch button
        watchButton.addEventListener('click', () => {
            openVideoPlayer(movie);
        });
    }
    
    // Function to hide movie details and return to list view
    function hideMovieDetailsPage() {
        document.getElementById('movie-details-view').classList.remove('active');
        document.getElementById('movie-list-view').classList.remove('hidden');
        document.getElementById('generate-section').style.display = 'block';
    }

    // Function to extract genres and rating from movie data
    async function extractGenres(movieText) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Analyze this movie description and production notes. 
                        Identify the most appropriate movie genres that apply to this film.
                        Also provide a critical rating score on a scale of 3.0 to 5.0.
                        Respond directly with JSON, following this JSON schema, and no other text:
                        {
                          "genres": string[] (2-3 genres from [Action, Adventure, Comedy, Drama, Fantasy, Horror, Romance, Sci-Fi, Thriller]),
                          "rating": number (between 3.0 and 5.0)
                        }`
                    },
                    {
                        role: "user",
                        content: movieText
                    }
                ],
                json: true
            });
            
            return JSON.parse(completion.content);
        } catch (error) {
            console.error("Error extracting genres:", error);
            return {
                genres: [],
                rating: (Math.random() * 2 + 3).toFixed(1) // Fallback random rating
            };
        }
    }

    // Utility function to generate a colorful gradient as a fallback for movie posters
    function generateColorfulGradient() {
        const colors = [
            '#FF5F6D,#FFC371', // Red-Orange
            '#36D1DC,#5B86E5', // Blue
            '#834d9b,#d04ed6', // Purple
            '#4DA0B0,#D39D38', // Teal-Gold
            '#5614B0,#DBD65C', // Purple-Yellow
            '#114357,#F29492', // Dark Blue-Pink
            '#1A2980,#26D0CE', // Deep Blue-Teal
            '#6A3093,#A044FF', // Purple
            '#403B4A,#E7E9BB', // Gray-Yellow
            '#C33764,#1D2671', // Pink-Blue
        ];
        
        const randomPair = colors[Math.floor(Math.random() * colors.length)];
        const [color1, color2] = randomPair.split(',');
        
        return `background: linear-gradient(45deg, ${color1}, ${color2})`;
    }

    // Function to generate a new movie poster
    async function generateMoviePoster(title, description) {
        try {
            const result = await websim.imageGen({
                prompt: `Movie poster for "${title}": ${description}. Professional cinematic movie poster style, dramatic lighting, no text or titles on the poster.`,
                aspect_ratio: "2:3"
            });
            return result.url;
        } catch (error) {
            console.error("Error generating poster image:", error);
            // Return a gradient as a fallback
            return generateColorfulGradient();
        }
    }

    // Set up tab switching in movie list view
    document.getElementById('all-movies-tab').addEventListener('click', function() {
        switchListTab('all-movies');
    });
    
    document.getElementById('my-movies-tab').addEventListener('click', function() {
        switchListTab('my-movies');
    });
    
    function switchListTab(tabName) {
        // Hide all tab contents
        document.querySelectorAll('.movie-list-tab-content').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Deactivate all tabs
        document.querySelectorAll('.movie-list-tab-button').forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Show selected tab content and activate tab
        document.getElementById(`${tabName}-content`).classList.add('active');
        document.getElementById(`${tabName}-tab`).classList.add('active');
        
        if (tabName === 'all-movies') {
            fetchPublishedMovies();
        } else {
            renderMovies(initialMovies);
        }
    }
    
    // Load published movies on startup
    fetchPublishedMovies();
    
    // Fetch published movies from database
    async function fetchPublishedMovies() {
        try {
            // Get all movies from the database
            let publishedMovies = room.collection('movie').getList();
            
            // Render if there are movies
            if (publishedMovies.length > 0) {
                renderPublishedMovies(publishedMovies);
            } else {
                // Show a message or load default movies
                const movieGrid = document.getElementById('all-movies-grid');
                movieGrid.innerHTML = '<div class="no-movies-message">Loading published movies...</div>';
                
                // Subscribe to changes
                room.collection('movie').subscribe(function(movies) {
                    if (movies.length > 0) {
                        renderPublishedMovies(movies);
                    }
                });
            }
        } catch (error) {
            console.error('Failed to fetch published movies:', error);
            const movieGrid = document.getElementById('all-movies-grid');
            movieGrid.innerHTML = '<div class="no-movies-message">Error loading published movies.</div>';
        }
    }

    function setupFavorites() {
        // Add favorite button to movie cards
        document.querySelectorAll('.movie-card').forEach(card => {
            // Check if button already exists to avoid duplicates
            if (card.querySelector('.favorite-button')) return;
            
            const favoriteButton = document.createElement('button');
            favoriteButton.className = 'favorite-button';
            favoriteButton.innerHTML = '❤ 0';
            
            const movieId = card.dataset.id;
            if (movieId) {
                // Get current favorite count
                const favCount = favorites.filter({ movie_id: movieId }).getList().length;
                if (favCount > 0) {
                    favoriteButton.innerHTML = `❤ ${favCount}`;
                }
                
                // Check if current user has favorited
                const userFavCount = favorites.filter({ 
                    movie_id: movieId, 
                    username: room.party.client.username 
                }).getList().length;
                
                if (userFavCount > 0) {
                    favoriteButton.classList.add('active');
                }
            }
            
            favoriteButton.addEventListener('click', async (e) => {
                e.stopPropagation();
                if (!movieId) return;
                
                try {
                    const userFavs = favorites.filter({ 
                        movie_id: movieId, 
                        username: room.party.client.username 
                    }).getList();
                    
                    if (userFavs.length > 0) {
                        // Remove favorite
                        await favorites.delete(userFavs[0].id);
                        favoriteButton.classList.remove('active');
                    } else {
                        // Add favorite
                        await favorites.create({ movie_id: movieId });
                        favoriteButton.classList.add('active');
                    }
                    
                    // Update count
                    const allFavs = favorites.filter({ movie_id: movieId }).getList();
                    favoriteButton.innerHTML = `❤ ${allFavs.length}`;
                } catch (error) {
                    console.error('Failed to toggle favorite:', error);
                }
            });
            
            card.appendChild(favoriteButton);
        });

        // Subscribe to favorite changes to keep counts updated
        favorites.subscribe(favs => {
            document.querySelectorAll('.movie-card').forEach(card => {
                const movieId = card.dataset.id;
                if (!movieId) return;

                const favoriteButton = card.querySelector('.favorite-button');
                if (!favoriteButton) return;

                const movieFavs = favs.filter(f => f.movie_id === movieId);
                favoriteButton.innerHTML = `❤ ${movieFavs.length}`;

                const userHasFaved = movieFavs.some(f => f.username === room.party.client.username);
                if (userHasFaved) {
                    favoriteButton.classList.add('active');
                } else {
                    favoriteButton.classList.remove('active');
                }
            });
        });
    }

    // Handle clicking on a published movie
    document.getElementById('all-movies-grid').addEventListener('click', (e) => {
        const movieCard = e.target.closest('.published-movie');
        if (movieCard) {
            const movieId = movieCard.dataset.id;
            
            // Get the movie from the collection
            const publishedMovies = room.collection('movie').getList();
            const selectedMovie = publishedMovies.find(movie => movie.id === movieId);
            
            if (selectedMovie) {
                showMovieDetailsPage(selectedMovie);
            }
        }
    });

    function renderPublishedMovies(movies) {
        const movieGrid = document.getElementById('all-movies-grid');
        movieGrid.innerHTML = '';
        
        if (movies.length === 0) {
            movieGrid.innerHTML = '<div class="no-movies-message">No published movies yet. Be the first to share your creation!</div>';
            return;
        }
        
        movies.forEach((movie) => {
            const movieCard = document.createElement('div');
            movieCard.className = 'movie-card published-movie';
            movieCard.dataset.id = movie.id;
            
            const posterStyle = movie.poster.startsWith('http') 
                ? `background-image: url(${movie.poster})` 
                : movie.poster;
            
            movieCard.innerHTML = `
                <div class="poster" style="${posterStyle}"></div>
                <div class="card-content">
                    <div class="card-title">${movie.title}</div>
                    <div class="card-year">${movie.year}</div>
                    <div class="card-creator">By: ${movie.username || 'Unknown'}</div>
                </div>
            `;
            
            movieGrid.appendChild(movieCard);
        });
        setupFavorites();
    }
    
    // Keep track of the currently displayed movie
    let currentMovie = null;

    // Function to generate user comments
    async function generateUserComments(movie) {
        try {
            const completion = await websim.chat.completions.create({
                messages: [
                    {
                        role: "system",
                        content: `Generate 3-4 brief user comments/reviews for this movie.
                        Each review should be 1-2 sentences maximum.
                        Each review should have a distinct writing style based on these persona types:
                        - Film enthusiast who uses formal language
                        - Casual viewer who uses simple language
                        - Emotional reviewer who is very passionate
                        - Teen/young adult who uses casual language
                        
                        Consider the movie's themes and content.
                        Use the current year (${new Date().getFullYear()}) for dates.
                        
                        Each review should have a rating between 1-5 stars (with ONE decimal: e.g. 3.5).
                        Create a diverse range of ratings - not all should be 4-5 stars.
                        
                        Response format (JSON array):
                        [
                          {
                            user: string,
                            persona: string,
                            rating: number,
                            text: string,
                            date: string,
                            likes: number
                          }
                        ]`
                    },
                    {
                        role: "user",
                        content: `Movie: ${movie.title}
                        Description: ${movie.description}
                        Genre: ${movie.genres ? movie.genres.join(', ') : 'Unknown'}
                        Themes: ${movie.productionNotes ? movie.productionNotes.map(note => note.notes).join(' ') : ''}`
                    }
                ],
                json: true
            });
        
            return JSON.parse(completion.content);
        } catch (error) {
            console.error("Error generating user comments:", error);
            const currentYear = new Date().getFullYear();
            return [
                { 
                    user: "MovieFan42",
                    persona: "Casual viewer",
                    rating: 4.0,
                    text: "Really enjoyed this one!",
                    date: `June 15, ${currentYear}`,
                    likes: 12
                }
            ];
        }
    }

    /**
     * Opens the video player overlay for the given movie.
     * Generates frames in real time (one per scene), updates the loaded progress as each frame is generated,
     * and allows incremental playback. Prevent seeking beyond loaded frames. 
     * Also allow clicking on the video to play/pause.
     */
    async function openVideoPlayer(movie) {
        // If a generation is in progress, don't start a new one
        if (isGeneratingFrames) {
            alert("Please wait, frame generation is already in progress.");
            return;
        }

        // Create video player container
        const videoPlayerOverlay = document.createElement('div');
        videoPlayerOverlay.className = 'video-player-overlay';
        videoPlayerOverlay.innerHTML = `
            <div class="video-player-container">
                <div class="video-player-header">
                    <div class="video-title">${movie.title}</div>
                    <button class="close-player-button">×</button>
                </div>
                <div class="video-content">
                    <div class="frame-container">
                        <img class="movie-frame" src="" alt="Movie frame">
                        <div class="subtitle-container">
                            <div class="subtitle-text"></div>
                        </div>
                    </div>
                </div>
                <div class="video-controls">
                    <div class="progress-container">
                        <div class="buffering-progress"></div>
                        <div class="playback-progress"></div>
                    </div>
                    <div class="control-buttons">
                        <button class="play-pause-button">
                            <span class="play-icon">▶</span>
                            <span class="pause-icon" style="display:none;">❚❚</span>
                        </button>
                        <div class="time-display">00:00 / 00:00</div>
                        <button class="fullscreen-button">⛶</button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(videoPlayerOverlay);
        
        // Set up event listeners
        const closeButton = videoPlayerOverlay.querySelector('.close-player-button');
        closeButton.addEventListener('click', () => {
            videoPlayerOverlay.remove();
            clearInterval(playbackInterval);
            document.removeEventListener('keydown', handleKeyPress);
        });
        
        const playPauseButton = videoPlayerOverlay.querySelector('.play-pause-button');
        const playIcon = videoPlayerOverlay.querySelector('.play-icon');
        const pauseIcon = videoPlayerOverlay.querySelector('.pause-icon');
        
        let isPlaying = false;
        let playbackInterval;
        let currentFrameIndex = 0;
        let frames = [];
        let subtitles = [];
        let totalFrames = 0;
        let framesLoadedCount = 0; // How many frames have been generated so far
        let isBuffering = false;
        
        // This will store the total length of the preview (in seconds)
        // We'll assume 1.5 seconds per frame.
        let totalPreviewLength = 0; 

        const frameImg = videoPlayerOverlay.querySelector('.movie-frame');
        const subtitleText = videoPlayerOverlay.querySelector('.subtitle-text');
        const bufferingProgress = videoPlayerOverlay.querySelector('.buffering-progress');

        // Lock generation so we don't start multiple at once
        isGeneratingFrames = true;
        
        // Stream frames as they are generated and update the video player
        (async () => {
            for await (const frameData of generateMovieFrames(movie)) {
                frames.push(frameData.frameUrl);
                subtitles.push(frameData.subtitle);
                framesLoadedCount = frames.length;
                updateProgressBar();
                // If playback is active and we’re waiting for the next frame, attempt to resume playback
                if (isPlaying && currentFrameIndex >= framesLoadedCount - 1) {
                    togglePlayback();
                }
            }
            totalFrames = frames.length;
            totalPreviewLength = totalFrames * 1.5;
            isGeneratingFrames = false;
        })().catch(err => {
            console.error("Frame generation error:", err);
            isGeneratingFrames = false;
        });

        playPauseButton.addEventListener('click', () => {
            togglePlayback();
        });

        // Also play/pause if user clicks on the video
        const frameContainer = videoPlayerOverlay.querySelector('.frame-container');
        frameContainer.addEventListener('click', () => {
            togglePlayback();
        });
        
        const fullscreenButton = videoPlayerOverlay.querySelector('.fullscreen-button');
        fullscreenButton.addEventListener('click', () => {
            const frameContainer = videoPlayerOverlay.querySelector('.frame-container');
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                frameContainer.requestFullscreen();
            }
        });
        
        // Progress bar interaction
        const progressContainer = videoPlayerOverlay.querySelector('.progress-container');
        progressContainer.addEventListener('click', (e) => {
            if (frames.length === 0) return;
            
            const rect = progressContainer.getBoundingClientRect();
            const clickPosition = e.clientX - rect.left;
            const percentage = clickPosition / rect.width;
            
            // Seek only within the loaded frames
            const maxSeekableFrames = framesLoadedCount > 0 ? framesLoadedCount - 1 : 0;
            let desiredFrameIndex = Math.floor(percentage * totalFrames);
            if (desiredFrameIndex > maxSeekableFrames) {
                desiredFrameIndex = maxSeekableFrames;
            }
            if (desiredFrameIndex < 0) desiredFrameIndex = 0;

            currentFrameIndex = desiredFrameIndex;
            updateProgressBar();
            showFrame(currentFrameIndex);
        });
        
        // Add keyboard controls for playback
        function handleKeyPress(e) {
            if (!videoPlayerOverlay.isConnected) {
                document.removeEventListener('keydown', handleKeyPress);
                return;
            }
            
            switch(e.key) {
                case ' ':
                case 'k':
                    togglePlayback();
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    skipForward();
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    skipBackward();
                    e.preventDefault();
                    break;
                case 'f':
                    fullscreenButton.click();
                    e.preventDefault();
                    break;
                case 'Escape':
                    if (document.fullscreenElement) {
                        document.exitFullscreen();
                    } else {
                        closeButton.click();
                    }
                    e.preventDefault();
                    break;
            }
        }
        document.addEventListener('keydown', handleKeyPress);
        
        function skipForward() {
            if (currentFrameIndex < framesLoadedCount - 1) {
                currentFrameIndex++;
                showFrame(currentFrameIndex);
                updateProgressBar();
            }
        }
        
        function skipBackward() {
            if (currentFrameIndex > 0) {
                currentFrameIndex--;
                showFrame(currentFrameIndex);
                updateProgressBar();
            }
        }
        
        function togglePlayback() {
            if (frames.length === 0) return; // No frames to play

            isPlaying = !isPlaying;
            
            if (isPlaying) {
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'inline';
                
                playbackInterval = setInterval(() => {
                    if (isBuffering) return;
                    
                    // Check if we can advance to next frame
                    if (currentFrameIndex < framesLoadedCount - 1) {
                        currentFrameIndex++;
                        showFrame(currentFrameIndex);
                        updateProgressBar();
                    } else {
                        // If we're at the end of loaded frames but not at the end of the video
                        if (currentFrameIndex < totalFrames - 1) {
                            // Wait for more frames
                            isBuffering = true;
                            subtitleText.textContent = "Buffering...";
                        } else {
                            // End of video reached
                            clearInterval(playbackInterval);
                            isPlaying = false;
                            playIcon.style.display = 'inline';
                            pauseIcon.style.display = 'none';
                        }
                    }
                }, 2500);
            } else {
                pausePlayback();
            }
        }

        function pausePlayback() {
            isPlaying = false;
            playIcon.style.display = 'inline';
            pauseIcon.style.display = 'none';
            clearInterval(playbackInterval);
        }
        
        function updateProgressBar() {
            // Playback progress is based on currentFrameIndex
            // We also show how many frames are loaded
            if (totalFrames <= 0) return;
            
            const playbackFraction = currentFrameIndex / (totalFrames - 1);
            const playbackWidth = Math.min(playbackFraction * 100, 100);
            videoPlayerOverlay.querySelector('.playback-progress').style.width = `${playbackWidth}%`;
            
            // Buffering bar (loaded-progress) is how many frames are loaded vs total
            const loadedFraction = framesLoadedCount / totalFrames;
            const bufferingWidth = Math.min(loadedFraction * 100, 100);
            bufferingProgress.style.width = `${bufferingWidth}%`;
            
            // Time display
            const currentTimeSec = Math.round(currentFrameIndex * 1.5);
            const totalTimeSec = Math.round((totalFrames - 1) * 1.5);
            videoPlayerOverlay.querySelector('.time-display').textContent = 
                `${formatTime(currentTimeSec)} / ${formatTime(totalTimeSec)}`;
        }
        
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const remainingSeconds = seconds % 60;
            return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        }
        
        function showFrame(frameIndex) {
            if (frameIndex >= 0 && frameIndex < frames.length) {
                frameImg.src = frames[frameIndex];
                if (subtitles[frameIndex]) {
                    subtitleText.textContent = subtitles[frameIndex];
                    subtitleText.style.display = 'block';
                } else {
                    subtitleText.textContent = '';
                    subtitleText.style.display = 'none';
                }
            } else {
                isBuffering = true;
                subtitleText.textContent = "Buffering...";
            }
        }

        /**
         * Generates frames for the given movie, returning { frames, subtitles } as they load.
         * We do this sequentially: one frame at a time.
         */
        async function* generateMovieFrames(movie) {
            const scenesData = [];
            // Start by building scene JSON
            try {
                const moviePrompt = `Generate key scene descriptions for a movie trailer of "${movie.title}". 
                    Plot: ${movie.description}
                    Genre: ${movie.genres ? movie.genres.join(', ') : 'Drama'}
                    Style: ${movie.promptOptions?.style?.join(', ') || 'Cinematic'},
                    Art Style: ${movie.promptOptions?.artStyle || 'Realistic'}
                `;
                const sceneCompletion = await websim.chat.completions.create({
                    messages: [
                        {
                            role: "system",
                            content: `You are a movie scene designer who creates compelling visual sequences.
                                      Create 8-12 key scenes for a movie trailer with brief descriptions and dialogue/subtitles.
                                      Include a mix of close-ups, wide shots, and dramatic moments that tell the story.
                                      Format as JSON array with these properties:
                                      [{ 
                                        "scene": "Brief visual description of the scene",
                                        "subtitle": "Dialogue or text that would appear" 
                                      }]`
                        },
                        { role: "user", content: moviePrompt }
                    ],
                    json: true
                });
                scenesData.push(...JSON.parse(sceneCompletion.content));
            } catch (error) {
                console.error("Error generating scene descriptions:", error);
                // Provide at least one scene if generation fails
                scenesData.push({
                    scene: "A dramatic establishing shot of the movie's main setting",
                    subtitle: movie.title
                });
            }
            
            // Make frame container visible immediately
            const frameImg = videoPlayerOverlay.querySelector('.movie-frame');
            frameImg.style.opacity = '1';
            isBuffering = false;
            
            // Generate frames one by one
            for (let i = 0; i < scenesData.length; i++) {
                subtitleText.textContent = `Generating scene ${i + 1} of ${scenesData.length}...`;
                let frameUrl, subtitle;
                try {
                    const frameResult = await generateSceneFrame(scenesData[i], movie);
                    frameUrl = frameResult.frameUrl;
                    subtitle = frameResult.subtitle;
                } catch (err) {
                    console.error("Error generating single frame:", err);
                    frameUrl = getFallbackFrame(scenesData[i]);
                    subtitle = scenesData[i].subtitle || "";
                }

                // Immediately show the first frame
                if (i === 0) {
                    frameImg.src = frameUrl;
                    subtitleText.textContent = subtitle;
                }

                yield { frameUrl, subtitle };
                
                // Update progress and try to continue playback if needed
                framesLoadedCount++;
                totalFrames = scenesData.length + 1; // +1 for title card
                updateProgressBar();
                
                // If we're playing and waiting for the next frame, show it
                if (isPlaying && currentFrameIndex >= framesLoadedCount - 2) {
                    currentFrameIndex++;
                    showFrame(currentFrameIndex);
                }
            }
            
            // Add final title card
            const titleCard = getFinalTitleCard(movie.title);
            yield { frameUrl: titleCard, subtitle: "" };
            
            subtitleText.textContent = "Preview ready - Click to play";
            isBuffering = false;
        }
        
        /**
         * Generate a single frame for a scene, possibly using makeup artist data.
         */
        async function generateSceneFrame(scene, movie) {
            let scenePrompt = scene.scene;

            // If makeupArtist usage is enabled, prepend appearances
            if (movie.useMakeupArtist && movie.makeupArtistData) {
                for (const character of movie.makeupArtistData) {
                    if (scenePrompt.toLowerCase().includes(character.name.toLowerCase())) {
                        // Insert the appearance text
                        scenePrompt = character.appearance + ". " + scenePrompt;
                    }
                }
            }

            const imageResult = await websim.imageGen({
                prompt: `Movie still from "${movie.title}" in the style of ${movie.promptOptions?.style?.join(', ') || 'cinematic'} and ${movie.promptOptions?.artStyle || 'realistic'}:
                ${scenePrompt}, film-like shot, professional cinematography, no text overlay`,
                aspect_ratio: "16:9"
            });
            
            return {
                frameUrl: imageResult.url,
                subtitle: scene.subtitle
            };
        }
        
        /**
         * Provide a fallback "Frame unavailable" placeholder if generation fails.
         */
        function getFallbackFrame(scene) {
            return `data:image/svg+xml;charset=utf8,
                    %3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E
                    %3Crect width='100%25' height='100%25' fill='%23000'/%3E
                    %3Ctext x='50%25' y='50%25' fill='%23fff' text-anchor='middle' 
                     dominant-baseline='middle' font-family='sans-serif' font-size='20'%3E
                     Unable to generate frame%3C/text%3E%3C/svg%3E`;
        }
        
        /**
         * Provide a final title card at the end.
         */
        function getFinalTitleCard(title) {
            return `data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='450'%3E%3Crect width='100%25' height='100%25' fill='%23000'/%3E%3Ctext x='50%25' y='50%25' fill='%23fff' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='32'%3E${encodeURIComponent(title)}%3C/text%3E%3Ctext x='50%25' y='60%25' fill='%23aaa' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='18'%3EComing soon%3C/text%3E%3C/svg%3E`;
        }
    }
});