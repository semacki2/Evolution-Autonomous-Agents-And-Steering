# Evolution-Autonomous-Agents-And-Steering
A fun visualization of a genetic algorithm, autonomous agents, and steering forces. 

The green dots are food, the red dots are poison, and the triangles are vehicles. 

The vehicles move autonomously through the canvas. While the simulation runs, the vehicle's health gradually depleats. The health of the vehicles is visualzied by the vehicle's color: the more green the vehicles, the healthier it is; the more red, the less heatlhy. When a vehicle runs out of health, it dies. 

If a vehicle comes into contact with the food, it will eat the food and gain some health. If the vehicle comes into contact with some poison, it will eat the poison and lose health. 

Each vehicle has it's own genes which determine how much it wants to steer towards food (can be positive or negative), how much it wants to steer towards poison (can be positive or negative), have far around itself it can see food, and how far around itself it can see poison. Every frame, there is a small chance that a vehicle will create a clone of itself. When a clone is created, there is a small chance that it's DNA could be slightly modified. 

The debug mode shows a green line, red line, green circle, and red circle. The green line visualizes the magnitude of the vehicle's attraction to food. If the line comes out the front of the vehicle, it is a positive value; if it comes out the back of the vehicle, it is a negative value. The red line works the same way but describes the vehicle's attraction to poison.In general, after the simulation has run for a while, you should notice that most of the surviving vehicles will have large positive green lines coming out the front, which indicates that the vehicle has a strong positive attraction towards food. You will likely also notice a moderate red line coming out of the back of the surviving vehicles; indicating a moderate negative attraction to poison. The green circle around a vehicle describes it's line of sight to food. The vehicle is only aware of food within its line of sight. The red circle works the same for poison. In general, after the simulation has run for a while, you should notice that most survivors have excellent line of sight genes, especially for food. 
