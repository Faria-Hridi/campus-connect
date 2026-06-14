const bcrypt = require('bcryptjs');
const hash = '$2b$10$I9gprwsmklw.8LairDjQi.O7HDd6F8f1EPXvHn24EaCMt8PXLk6/u';
const plain = 'Student123!';
(async () => {
  console.log('compare result', await bcrypt.compare(plain, hash));
  console.log('hash generated', await bcrypt.hash(plain, 10));
})();
