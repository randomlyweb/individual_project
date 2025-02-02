import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../componentsCss/App.css';
import axiosInstance from './axiosInstance';

const App = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredBlocks, setFilteredBlocks] = useState([]);

  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        const response = await axiosInstance.get('blocks/');
        setBlocks(response.data);
        setFilteredBlocks(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Ошибка при получении блоков:', error);
        setLoading(false);
      }
    };

    fetchBlocks();
  }, []);

  useEffect(() => {
    const filtered = blocks.filter(block =>
      block.file_hash.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredBlocks(filtered);
  }, [searchQuery, blocks]);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await axiosInstance.patch(`blocks/${id}/`, { status: newStatus });
      setBlocks(blocks.map(block =>
        block.id === id ? { ...block, status: newStatus } : block
      ));
    } catch (error) {
      console.error('Ошибка при изменении статуса блока:', error);
    }
  };

  return (
    <div className="teacher-panel">
      <h1>Панель учителя</h1>
      <div className="search-container" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Поиск по Хешу файла"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '8px', width: '100%', maxWidth: '400px' }}
        />
      </div>

      <div className="blocks-container">
        {loading ? (
          <p>Загрузка блоков...</p>
        ) : (
          <div className="row">
            {filteredBlocks.length === 0 ? (
              <p>Блоки не найдены</p>
            ) : (
              filteredBlocks.map((block) => (
                <div className="col-12 col-sm-6 col-md-3" key={block.id}>
                  <div className="block-card">
                    <h4>{block.work_title}</h4>
                    <p>Статус: {block.status}</p>
                    <div className="file-hash-container">
                      <p>Хеш файла:</p>
                      <p className="file-hash">{block.file_hash}</p>
                    </div>
                    <a href={`/blocks/${block.id}`} className="view-work-link">Посмотреть работу</a>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;