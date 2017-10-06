class HeaderSplitter {
    constructor(minLeave, maxLeave) {
        const splittedLeaves = [];
        let leaveIndex = -1;

        function toRoots() {
            const res = [];
            const met = new Set();
            for (let i = 0; i < splittedLeaves.length; i++) {
                const leaf = splittedLeaves[i];
                let parent = leaf;
                while (parent.parent) {
                    parent = parent.parent;
                }
                if (!met.has(parent)) {
                    met.add(parent);
                    res.push(parent);
                }
            }
            return res;
        }
        Object.defineProperty(this, 'toRoots', {
            get: function() {
                return toRoots;
            }
        });

        function process(toBeSplitted, aClonedParent) {
            let res = false;
            for (let i = 0; i < toBeSplitted.length; i++) {
                const n = toBeSplitted[i];
                const nc = n.copy();
                if (n.children.length === 0) {
                    leaveIndex++;
                    if (leaveIndex >= minLeave && leaveIndex <= maxLeave) {
                        res = true;
                        splittedLeaves.push(nc);
                        if (aClonedParent) {
                            aClonedParent.addColumnNode(nc);
                        }
                    }
                } else {
                    const isGoodLeaveIndex = process(n.children, nc);
                    if (isGoodLeaveIndex) {
                        res = true;
                        if (aClonedParent) {
                            aClonedParent.addColumnNode(nc);
                        }
                    }
                }
            }
            return res;
        }
        Object.defineProperty(this, 'process', {
            get: function() {
                return process;
            }
        });
    }
}

const module = {};

function split(toBeSplitted, aMinLeave, aMaxLeave) {
    const splitter = new HeaderSplitter(aMinLeave, aMaxLeave);
    splitter.process(toBeSplitted, null);
    return splitter.toRoots();
}
Object.defineProperty(module, 'split', {
    get: function() {
        return split;
    }
});

export default module;