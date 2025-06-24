        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        const scoreElement = document.getElementById('score');
        const gameOverElement = document.getElementById('gameOver');
        const finalScoreElement = document.getElementById('finalScore');

        // Pengaturan game
        const gridSize = 20;
        const tileCount = canvas.width / gridSize;

        let snake = [
            {x: 10, y: 10}
        ];
        let food = {};
        let dx = 0;
        let dy = 0;
        let score = 0;
        let gameRunning = true;

        // Inisialisasi game
        function init() {
            generateFood();
            gameLoop();
        }

        // Fungsi utama game loop
        function gameLoop() {
            if (!gameRunning) return;
            
            setTimeout(function() {
                clearCanvas();
                moveSnake();
                drawFood();
                drawSnake();
                checkGameOver();
                gameLoop();
            }, 150);
        }

        // Bersihkan canvas
        function clearCanvas() {
            ctx.fillStyle = '#1a1a1a';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Gerakkan ular
        function moveSnake() {
            const head = {x: snake[0].x + dx, y: snake[0].y + dy};
            snake.unshift(head);

            // Periksa apakah ular memakan makanan
            if (head.x === food.x && head.y === food.y) {
                score += 10;
                scoreElement.textContent = score;
                generateFood();
            } else {
                snake.pop();
            }
        }

        // Gambar ular
        function drawSnake() {
            ctx.fillStyle = '#4ade80';
            snake.forEach((segment, index) => {
                if (index === 0) {
                    // Kepala ular dengan warna berbeda
                    ctx.fillStyle = '#22c55e';
                } else {
                    ctx.fillStyle = '#4ade80';
                }
                
                ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
                
                // Tambahkan border untuk efek 3D
                ctx.strokeStyle = '#16a34a';
                ctx.lineWidth = 1;
                ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
            });
        }

        // Generate makanan secara acak
        function generateFood() {
            food = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };

            // Pastikan makanan tidak muncul di tubuh ular
            snake.forEach(segment => {
                if (segment.x === food.x && segment.y === food.y) {
                    generateFood();
                }
            });
        }

        // Gambar makanan
        function drawFood() {
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
            
            // Tambahkan efek berkilau pada makanan
            ctx.fillStyle = '#fca5a5';
            ctx.fillRect(food.x * gridSize + 2, food.y * gridSize + 2, gridSize - 6, gridSize - 6);
        }

        // Periksa kondisi game over
        function checkGameOver() {
            const head = snake[0];

            // Periksa tabrakan dengan dinding
            if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
                gameOver();
            }

            // Periksa tabrakan dengan tubuh sendiri
            for (let i = 1; i < snake.length; i++) {
                if (head.x === snake[i].x && head.y === snake[i].y) {
                    gameOver();
                }
            }
        }

        // Fungsi game over
        function gameOver() {
            gameRunning = false;
            finalScoreElement.textContent = score;
            gameOverElement.style.display = 'block';
        }

        // Restart game
        function restartGame() {
            snake = [{x: 10, y: 10}];
            dx = 0;
            dy = 0;
            score = 0;
            scoreElement.textContent = score;
            gameRunning = true;
            gameOverElement.style.display = 'none';
            generateFood();
            gameLoop();
        }

        // Event listener untuk kontrol keyboard
        document.addEventListener('keydown', function(e) {
            if (!gameRunning) return;

            // Cegah arah berlawanan
            switch(e.code) {
                case 'ArrowUp':
                case 'KeyW':
                    if (dy !== 1) {
                        dx = 0;
                        dy = -1;
                    }
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    if (dy !== -1) {
                        dx = 0;
                        dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    if (dx !== 1) {
                        dx = -1;
                        dy = 0;
                    }
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    if (dx !== -1) {
                        dx = 1;
                        dy = 0;
                    }
                    break;
            }
        });

        // Mulai game
        init();
