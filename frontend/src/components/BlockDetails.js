import React, { useState, useEffect } from 'react';
import axiosInstance from './axiosInstance'; 
import { useParams, useNavigate } from 'react-router-dom';
import '../componentsCss/BlockDetail.css';

const BlockDetails = () => {
  const { id } = useParams();
  const [block, setBlock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState(""); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchBlock = async () => {
      try {
        const response = await axiosInstance.get(`blocks/?block_id=${id}`);
        setBlock(response.data);
        setLoading(false);
        setSelectedStatus(response.data.status);
      } catch (error) {
        console.error('Ошибка при получении блока:', error);
        setLoading(false);
      }
    };

    fetchBlock();
  }, [id]);

  const handleStatusChange = async () => {
    try {
      await axiosInstance.patch(`blocks/${id}/`, { status: selectedStatus }); 
      setBlock({ ...block, status: selectedStatus }); 
    } catch (error) {
      console.error('Ошибка при изменении статуса блока:', error);
    }
  };

  if (loading) {
    return <p>Загрузка...</p>;
  }

  if (!block) {
    return <p>Блок не найден.</p>;
  }

  return (
    <div className="block-details">
      <h2>Детали блока #{block.id}</h2>

      <div className="row">
        <p><strong>Название работы:</strong> {block.work_title}</p>
        <p><strong>Статус:</strong> {block.status}</p>
        <p><strong>Файл:</strong> <a href={`${process.env.REACT_APP_FILES_URL}${block.file}`} download>Скачать файл</a></p>
        <p><strong>Хеш файла:</strong> {block.file_hash}</p>
      </div>

      <div>
        <label htmlFor="status-select"><strong>Выберите статус:</strong></label>
        <select
          id="status-select"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}  
        >
          <option value="отправлено">Отправлено</option>
          <option value="просмотрено">Просмотрено</option>
          <option value="проверено">Проверено</option>
          <option value="оценено">Оценено</option>
        </select>
      </div>

      <div>
        <button onClick={handleStatusChange} className="confirm-btn">
          Подтвердить
        </button>
      </div>

      <div>
        <button onClick={() => navigate('/')} className="return-btn">
          Вернуться к списку
        </button>
      </div>
    </div>
  );
};

export default BlockDetails;
