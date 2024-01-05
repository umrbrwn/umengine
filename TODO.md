Features:

- [HIGH] Implement serializer decorator for atom, components, and other artifacts like scenes, so that they can be saved and loaded from files
- [HIGH] Implement a simple resource manager that can load and deserialize resources from files
- [HIGH] Implement json schema for the atom files so that scenes, or atoms can be written in json and simply loaded in a low code fashion

Refactoring:

- [MID] Breakdown scene class into renderer system, update system, and physics system
- [MID] Implement update system with proper fixed update for physics and update cycles
- [LOW] Implement tsyringe or inversifyjs for dependency inversion to make code simple
