class TaskQueue {
	constructor(max) {
		this.max = (max || 5);
		this.nextPointer = 0;
		this.queue = [];
		this.performing = 0;
	}
	finishTask() {
		this.performing -= 1;
		this.work();
	}
	enqueueTask(task, data) {
		if(typeof data == "undefined") data = null;
		this.queue.push([task, data]);
		this.work();
	}
	work() {
		if(this.max > this.performing) {
			if(typeof this.queue[this.nextPointer] == "undefined") {
				console.debug("Queue finished");
				this.nextPointer = 0;
				this.queue = [];
			} else {
				this.queue[this.nextPointer][0](this, this.queue[this.nextPointer][1]);
				this.performing += 1;
				this.nextPointer += 1;
			}
		}
	}
}