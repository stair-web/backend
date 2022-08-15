import { uuidv4 } from './common.util';

export const editCandidateFileName = (req, file, callback) => {
  const name = 'candidate';
  const type = file.fieldname;
  const uuid = uuidv4();
  const typeFile = file.originalname.match(/\.[0-9a-z]+$/i)[0];
  callback(null, `${name}-${type}-${uuid}${typeFile}`);
};

export const filterCandidateFile = (req, file, callback) => {
  if (!file.originalname.match(/\.(doc|docx|pdf|png|jpeg|jpg)$/)) {
    return callback(new Error('Only doc/docx/pdf/png/jpeg/jpg files are allowed!'), false);
  }
  callback(null, true);
};

