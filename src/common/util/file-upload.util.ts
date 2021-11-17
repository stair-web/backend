import { uuidv4 } from './common.util';

export const editCandidateFileName = (req, file, callback) => {
  const name = 'candidate';
  const type = file.fieldname;
  const uuid = uuidv4();
  const typeFile = file.originalname.match(/\.[0-9a-z]+$/i)[0];
  callback(null, `${name}-${type}-${uuid}${typeFile}`);
};

export const filterCandidateFile = (req, file, callback) => {
  if (!file.originalname.match(/\.(doc|docx|pdf)$/)) {
    return callback(new Error('Only doc/docx/pdf files are allowed!'), false);
  }
  callback(null, true);
};

export const getFileUrl = (fileName: string) => {
  return (
    process.env.PROTOCOL +
    '://' +
    process.env.SERVER_HOST +
    ':' +
    process.env.SERVER_PORT +
    '/candidate/download/' +
    fileName
  );
};
