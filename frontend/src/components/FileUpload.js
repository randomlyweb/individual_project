import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';

import '../componentsCss/FileUpload.css'

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [subjectName, setSubjectName] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [blockHash, setBlockHash] = useState('');
  const [success, setSuccess] = useState(false);

  // Получаем список предметов при загрузке страницы
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/subjects/');
        setSubjects(response.data);
      } catch (error) {
        console.error("Ошибка при получении предметов:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !subjectName || !workTitle) {
      setMessage("Пожалуйста, заполните все поля.");
      setSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('subject_name', subjectName);
    formData.append('work_title', workTitle);

    try {
      setLoading(true);
      const response = await axios.post('http://127.0.0.1:8000/api/v1/blocks/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Файл успешно отправлен на проверку');

      setBlockHash(response.data.file_hash);
      setSuccess(true);
    } catch (error) {
      setMessage("Ошибка при загрузке файла.");
      setSuccess(false);
      console.error("Ошибка при отправке файла:", error);

      if (error.response && error.response.data && error.response.data.message === 'Такой документ уже существует!') {
        toast.error('Документ, который Вы попытались отправить, уже зарегестрирован в нашей системе! Пожалуйста, отправьте оригинальный документ');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="file-upload" style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
        <h2>Загрузите вашу работу</h2>

        {!success && (
          <form onSubmit={handleSubmit} style={{ display: 'block', textAlign: 'center' }}>
            <div>
              <label htmlFor="file-input">Выберите файл:</label>
              <input
                type="file"
                id="file-input"
                onChange={handleFileChange}
                style={{ margin: '10px 0' }}
              />
            </div>

            <div>
              <label htmlFor="subject-select">Предмет:</label>
              <select
                id="subject-select"
                value={subjectName}
                onChange={(e) => setSubjectName(e.target.value)}
                style={{ margin: '10px 0' }}
              >
                <option value="">Выберите предмет</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.name}>{subject.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="work-title">Название работы:</label>
              <input
                type="text"
                id="work-title"
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                style={{ margin: '10px 0' }}
              />
            </div>

            <div>
              <button type="submit" style={{ backgroundColor: 'black', color: 'white', padding: '10px 20px', border: 'none' }} disabled={loading}>
                {loading ? 'Загрузка...' : 'Отправить'}
              </button>
            </div>
          </form>
        )}

        {success && (
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <p style={{ color: 'green' }}>Файл успешно отправлен на проверку</p>
            <p>Ваш хеш блока: <strong>{blockHash}</strong></p>
            <p>Пожалуйста, передайте этот хеш учителю для проверки работы.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
