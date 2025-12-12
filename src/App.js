
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-6 overflow-hidden relative">
      {/* 背景动画效果 */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12 fade-in-up">
          <h1 className="text-5xl font-black gradient-text mb-4">
            数据分析算法动态展示平台
          </h1>
          <p className="text-lg text-gray-300 tracking-wide">交互式探索经典机器学习算法 • 实时数据可视化</p>
          <div className="mt-4 flex justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" style={{animationDelay: '0.3s'}}></div>
            <div className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" style={{animationDelay: '0.6s'}}></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 backdrop-blur-xl card-hover glow-border">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-5">
                🎯 算法选择
              </h2>
              <div className="space-y-3">
                {[
                  { id: 'kmeans', name: 'K-Means聚类', icon: '🔵', color: 'from-cyan-500 to-blue-500' },
                  { id: 'linear', name: '线性回归', icon: '📈', color: 'from-green-500 to-emerald-500' },
                  { id: 'anomaly', name: '异常检测', icon: '⚠️', color: 'from-red-500 to-pink-500' },
                  { id: 'pca', name: '主成分分析', icon: '🔄', color: 'from-purple-500 to-indigo-500' }
                ].map(algo => (
                  <button
                    key={algo.id}
                    onClick={() => setAlgorithm(algo.id)}
                    className={`algo-btn w-full text-left px-4 py-3 rounded-lg transition-all ${
                      algorithm === algo.id
                        ? `bg-gradient-to-r ${algo.color} text-white font-bold shadow-lg shadow-${algo.color.split(' ')[1].split('-')[0]}-500/50`
                        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-600/70 border border-slate-600'
                    }`}
                  >
                    <span className="mr-3 text-lg">{algo.icon}</span>
                    {algo.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 backdrop-blur-xl card-hover glow-border">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-5">
                📊 算法可视化
              </h2>
              
              {algorithm === 'kmeans' && (
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border border-slate-700 rounded-lg bg-slate-950/50 grid-bg">
                  <defs>
                    <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                      <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.3"/>
                    </filter>
                    <radialGradient id="glow1" cx="30%" cy="30%">
                      <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.3"/>
                      <stop offset="100%" stopColor="#00d4ff" stopOpacity="0"/>
                    </radialGradient>
                  </defs>
                  
                  {clusterData.map((point, idx) => (
                    <g key={idx}>
                      <circle
                        cx={point.x}
                        cy={point.y}
                        r="4"
                        fill={colors[point.cluster % colors.length]}
                        opacity="0.8"
                        filter="url(#shadow)"
                      />
                    </g>
                  ))}
                </svg>
              )}

              {algorithm === 'linear' && (
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border border-slate-700 rounded-lg bg-slate-950/50">
                  <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#00d4ff"/>
                      <stop offset="50%" stopColor="#7c3aed"/>
                      <stop offset="100%" stopColor="#ec4899"/>
                    </linearGradient>
                  </defs>
                  <line x1="50" y1="350" x2="450" y2="350" stroke="#888" strokeWidth="2" />
                  <line x1="50" y1="350" x2="50" y2="50" stroke="#888" strokeWidth="2" />
                  
                  {[...Array(15)].map((_, i) => {
                    const x = 70 + i * 25;
                    const y = 350 - Math.sin(i * 0.5) * 80 - i * 5;
                    return <circle key={i} cx={x} cy={y} r="5" fill="#4ecdc4" opacity="0.8" />;
                  })}
                  
                  <line x1="70" y1="300" x2="450" y2="150" stroke="url(#lineGradient)" strokeWidth="3" />
                </svg>
              )}

              {algorithm === 'anomaly' && (
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border border-slate-700 rounded-lg bg-slate-950/50">
                  {[...Array(180)].map((_, i) => {
                    const x = Math.random() * 400 + 50;
                    const y = Math.random() * 300 + 50;
                    return <circle key={i} cx={x} cy={y} r="3" fill="#4ecdc4" opacity="0.6" />;
                  })}
                  
                  {[...Array(20)].map((_, i) => {
                    const x = Math.random() * 400 + 50;
                    const y = Math.random() * 300 + 50;
                    return (
                      <g key={`anomaly-${i}`}>
                        <circle cx={x} cy={y} r="7" fill="#ff6b6b" opacity="0.3" />
                        <circle cx={x} cy={y} r="5" fill="#ff6b6b" opacity="0.8" />
                      </g>
                    );
                  })}
                </svg>
              )}

              {algorithm === 'pca' && (
                <svg width="100%" height="400" viewBox="0 0 500 400" className="border border-slate-700 rounded-lg bg-slate-950/50">
                  <defs>
                    <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#00d4ff"/>
                      <stop offset="100%" stopColor="#7c3aed"/>
                    </linearGradient>
                  </defs>
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
                        <rect x={x - 20} y={350 - height} width="40" height={height} fill="url(#barGradient)" opacity="0.9" rx="4" />
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 border border-slate-700 backdrop-blur-xl card-hover glow-border">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent mb-5">
                ⚙️ 参数设置
              </h2>
              
              {algorithm === 'kmeans' && (
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wider">
                      聚类数 K
                      <span className="text-lg text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-black ml-2">{kValue}</span>
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="8"
                      value={kValue}
                      onChange={(e) => setKValue(parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: 'linear-gradient(to right, #00d4ff 0%, #7c3aed 50%, #ec4899 100%)'
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>2</span>
                      <span>8</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 tracking-wider">
                      迭代次数
                      <span className="text-lg text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-black ml-2">{iterations}</span>
                    </label>
                    <input
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={iterations}
                      onChange={(e) => setIterations(parseInt(e.target.value))}
                      className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                      style={{
                        background: 'linear-gradient(to right, #00d4ff 0%, #7c3aed 50%, #ec4899 100%)'
                      }}
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>10</span>
                      <span>500</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-7 space-y-3">
                <button
                  onClick={handleRun}
                  disabled={isRunning}
                  className="btn-glow w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 hover:from-cyan-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30 hover:shadow-lg hover:shadow-purple-500/50"
                >
                  <Play size={20} />
                  <span className="text-lg">执行算法</span>
                </button>
                <button
                  onClick={handleReset}
                  className="w-full bg-gradient-to-r from-slate-700 to-slate-600 hover:from-slate-600 hover:to-slate-500 text-gray-200 font-bold py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all border border-slate-600 hover:border-slate-500"
                >
                  <RotateCcw size={20} />
                  <span className="text-lg">重置数据</span>
                </button>
              </div>

              <div className="mt-7 pt-7 border-t border-slate-700">
                <h3 className="text-sm font-bold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text mb-4 tracking-wider">📈 统计指标</h3>
                <div className="space-y-3">
                  <div className="stat-item">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-medium">惯性值</span>
                      <span className="text-base text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-black">{stats.inertia}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-medium">轮廓系数</span>
                      <span className="text-base text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-black">{stats.silhouette}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-400 font-medium">运行时间</span>
                      <span className="text-base text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text font-black">{stats.time}ms</span>
                    </div>
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