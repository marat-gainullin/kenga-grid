class HeaderAnalyzer {
    constructor() {
        let depth = 0;

        function maxDepth(aForest, aDepth) {
            aDepth++;
            if (depth < aDepth) {
                depth = aDepth;
            }
            for (let i = 0; i < aForest.length; i++) {
                const n = aForest[i];
                n.depthRemainder = 0;
                n.leavesCount = 0;
                if (n.children.length > 0) {
                    maxDepth(n.children, aDepth);
                }
            }
        }
        Object.defineProperty(this, 'maxDepth', {
            get: function() {
                return maxDepth;
            }
        });
        Object.defineProperty(this, 'depth', {
            get: function() {
                return depth;
            }
        });

        function mineDepth(aForest, aDepth) {
            aDepth++;
            for (let i = 0; i < aForest.length; i++) {
                const n = aForest[i];
                if (!n.leaf) {
                    mineDepth(n.children, aDepth);
                } else {
                    n.depthRemainder = depth - aDepth;
                }
            }
        }
        Object.defineProperty(this, 'mineDepth', {
            get: function() {
                return mineDepth;
            }
        });

        function mineLeaves(aLevel, aParent) {
            let leavesCount = 0;
            for (let i = 0; i < aLevel.length; i++) {
                const n = aLevel[i];
                if (n.visible) {
                    if (!n.leaf) {
                        leavesCount += mineLeaves(n.children, n);
                    } else {
                        leavesCount += 1;
                    }
                }
            }
            if (aParent) {
                aParent.leavesCount = leavesCount;
            }
            return leavesCount;
        }
        Object.defineProperty(this, 'mineLeaves', {
            get: function() {
                return mineLeaves;
            }
        });
    }
}

const module = {};

function analyzeDepth(aForest) {
    const analyzer = new HeaderAnalyzer();
    analyzer.maxDepth(aForest, 0);
    analyzer.mineDepth(aForest, 0);
    return analyzer.depth;
}
Object.defineProperty(module, 'analyzeDepth', {
    get: function() {
        return analyzeDepth;
    }
});

function analyzeLeaves(aForest) {
    const analyzer = new HeaderAnalyzer();
    analyzer.mineLeaves(aForest, null);
}
Object.defineProperty(module, 'analyzeLeaves', {
    get: function() {
        return analyzeLeaves;
    }
});

function achieveLeaves(aRoots, aLeaves) {
    aRoots.forEach(node => {
        if (node.leaf) {
            aLeaves.push(node);
        } else {
            achieveLeaves(node.children, aLeaves);
        }
    });
}

function toLeaves(aRoots) {
    const leaves = [];
    achieveLeaves(aRoots, leaves);
    return leaves;
}
Object.defineProperty(module, 'toLeaves', {
    get: function() {
        return toLeaves;
    }
});

export default module;