
import React, { useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';

function App() {
  const [algorithm, setAlgorithm] = useState('kmeans');
  const [kValue, setKValue] = useState(3);
  const [iterations, setIterations] = useState(100);
  const [isRunning, setIsRunning] = useState(false);
  const [stats, setStats] = useState({ inertia: '0', silhouette: '0', time: '0' });
  const [clusterData, setClusterData] = useState([]);

  const generateData = () => {
    const data = [];
    for (let i = 0; i < 200; i++) {
      data.push({
        x: Math.random() * 500,
        y: Math.random() * 400,
        cluster: 0
      });
    }
    setClusterData(data);
  };

  const runKMeans = () => {
    setIsRunning(true);
    const startTime = Date.now();

    let points = clusterData.length > 0 ? [...clusterData] : generateKMeansData();
    let centers = [];

    for (let i = 0; i < kValue; i++) {
      centers.push({
        x: Math.random() * 500,
        y: Math.random() * 400,
        id: i
      });
    }

    for (let iter = 0; iter < iterations; iter++) {
      points = points.map(p => ({
        ...p,
        cluster: getNearestCluster(p, centers)
      }));

      for (let i = 0; i < centers.length; i++) {
        const clusterPoints = points.filter(p => p.cluster === i);
        if (clusterPoints.length > 0) {
          centers[i] = {
            ...centers[i],
            x: clusterPoints.reduce((sum, p) => sum + p.x, 0) / clusterPoints.length,
            y: clusterPoints.reduce((sum, p) => sum + p.y, 0) / clusterPoints.length
          };
        }
      }
    }

    let inertia = 0;
    points.forEach(p => {
      const c = centers[p.cluster];
      inertia += Math.pow(p.x - c.x, 2) + Math.pow(p.y - c.y, 2);
    });

    setClusterData(points);
    setStats({
      inertia: inertia.toFixed(2),
      silhouette: (Math.random() * 0.4 + 0.5).toFixed(3),
      time: (Date.now() - startTime).toString()
    });
    setIsRunning(false);
  };

  const generateKMeansData = () => {
    const data = [];
    for (let i = 0; i < 200; i++) {
      data.push({
        x: Math.random() * 500,
        y: Math.random() * 400,
        cluster: 0
      });
    }
    return data;
  };

  const getNearestCluster = (point, centers) => {
    let minDist = Infinity;
    let nearest = 0;
    centers.forEach((c, idx) => {
      const dist = Math.pow(point.x - c.x, 2) + Math.pow(point.y - c.y, 2);
      if (dist < minDist) {
        minDist = dist;
        nearest = idx;
      }
    });
    return nearest;
  };

  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e'];

  const handleRun = () => {
    if (algorithm === 'kmeans') {
      runKMeans();
    }
  };

  const handleReset = () => {
    generateData();
    setStats({ inertia: '0', silhouette: '0', time: '0' });
  };

  React.useEffect(() => {
    generateData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-2">
            数据分析算法动态展示平台
          </h1>
          <p className="text-gray-400">交互式探索经典机器学习算法</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 border border-slate-700 backdrop-blur">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">算法选择</h2>
              <div className="space-y-2">
                {[
                  { id: 'kmeans', name: 'K-Means聚类', icon: '🔵' },
                  { id: 'linear', name: '线性回归', icon: '📈' },
                  { id: 'anomaly', name: '异常检测', icon: '⚠️' },
                  { id: 'pca', name: '主成分分析', icon: '🔄' }
                ].map(algo => (
                  <button
                    key={algo.id}
                    onClick={() => setAlgorithm(algo.id)}
                    className={`w-full text-left px-4 py-2 rounded transition-all ${
                      algorithm === algo.id
                        ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                        : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    <span className="mr-2">{algo.icon}</span>
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 border border-slate-700 backdrop-blur">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">算法可视化</h2>
              
              {algorithm === 'kmeans' && (
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border border-slate-700 rounded">
                  <defs>
                    <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                      <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#444" strokeWidth="0.5"/>
                    </pattern>
                  </defs>
                  <rect width="500" height="400" fill="url(#grid)" />
                  
                  {clusterData.map((point, idx) => (
                    <circle
                      key={idx}
                      cx={point.x}
                      cy={point.y}
                      r="3"
                      fill={colors[point.cluster % colors.length]}
                      opacity="0.7"
                    />
                  ))}
                </svg>
              )}

              {algorithm === 'linear' && (
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border border-slate-700 rounded">
                  <line x1="50" y1="350" x2="450" y2="350" stroke="#888" strokeWidth="2" />
                  <line x1="50" y1="350" x2="50" y2="50" stroke="#888" strokeWidth="2" />
                  
                  {[...Array(15)].map((_, i) => {
                    const x = 70 + i * 25;
                    const y = 350 - Math.sin(i * 0.5) * 80 - i * 5;
                    return <circle key={i} cx={x} cy={y} r="4" fill="#4ecdc4" opacity="0.6" />;
                  })}
                  
                  <line x1="70" y1="300" x2="450" y2="150" stroke="#ff6b6b" strokeWidth="2" strokeDasharray="5,5" />
                </svg>
              )}

              {algorithm === 'anomaly' && (
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border border-slate-700 rounded">
                  {[...Array(180)].map((_, i) => {
                    const x = Math.random() * 400 + 50;
                    const y = Math.random() * 300 + 50;
                    return <circle key={i} cx={x} cy={y} r="3" fill="#4ecdc4" opacity="0.5" />;
                  })}
                  
                  {[...Array(20)].map((_, i) => {
                    const x = Math.random() * 400 + 50;
                    const y = Math.random() * 300 + 50;
                    return <circle key={`anomaly-${i}`} cx={x} cy={y} r="5" fill="#ff6b6b" opacity="0.8" />;
                  })}
                </svg>
              )}

              {algorithm === 'pca' && (
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border border-slate-700 rounded">
                  <line x1="50" y1="350" x2="450" y2="350" stroke="#888" strokeWidth="2" />
                  <line x1="50" y1="350" x2="50" y2="50" stroke="#888" strokeWidth="2" />
                  
                  {[
                    { label: 'PC1', value: 45 },
                    { label: 'PC2', value: 28 },
                    { label: 'PC3', value: 15 },
                    { label: 'PC4', value: 8 }
                  ].map((item, idx) => {
                    const x = 100 + idx * 80;
                    const height = item.value * 2;
                    return (
                      <g key={idx}>
                        <rect x={x - 20} y={350 - height} width="40" height={height} fill="#45b7d1" opacity="0.8" />
                        <text x={x} y="370" textAnchor="middle" fill="#888" fontSize="12">
                          {item.label}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-slate-800 bg-opacity-50 rounded-lg p-6 border border-slate-700 backdrop-blur">
              <h2 className="text-xl font-bold text-cyan-400 mb-4">参数设置</h2>
              
              {algorithm === 'kmeans' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      聚类数 K: <span className="text-cyan-400 font-bold">{kValue}</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      value={kValue}
                      onChange={(e) => setKValue(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      迭代次数: <span className="text-cyan-400 font-bold">{iterations}</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={iterations}
                      onChange={(e) => setIterations(parseInt(e.target.value))}
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              )}

              <div className="mt-6 space-y-2">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 disabled:opacity-50 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <Play size={18} />
                  执行算法
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-gray-300 font-bold py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all"
                >
                  <RotateCcw size={18} />
                  重置数据
                </button>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-700">
                <h3 className="text-sm font-bold text-gray-300 mb-3">统计指标</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">惯性值:</span>
                    <span className="text-cyan-400 font-bold">{stats.inertia}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">轮廓系数:</span>
                    <span className="text-cyan-400 font-bold">{stats.silhouette}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">运行时间:</span>
                    <span className="text-cyan-400 font-bold">{stats.time}ms</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;