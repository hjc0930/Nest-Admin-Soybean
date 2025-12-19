import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkFolderFiles() {
    const folderId = 1; // 要检查的文件夹 ID

    console.log(`\n=== 检查文件夹 ID: ${folderId} ===\n`);

    // 1. 查询文件夹信息
    const folder = await prisma.sysFileFolder.findUnique({
        where: { folderId },
        select: {
            folderId: true,
            folderName: true,
            delFlag: true,
            tenantId: true,
        },
    });

    console.log('文件夹信息:', JSON.stringify(folder, null, 2));

    // 2. 查询文件夹下的所有文件（包括已删除的）
    const allFiles = await prisma.sysUpload.findMany({
        where: { folderId },
        select: {
            uploadId: true,
            fileName: true,
            delFlag: true,
            createTime: true,
            updateTime: true,
        },
    });

    console.log(`\n所有文件 (共 ${allFiles.length} 个):`);
    allFiles.forEach((file, index) => {
        console.log(`${index + 1}. ${file.fileName}`);
        console.log(`   - uploadId: ${file.uploadId}`);
        console.log(`   - delFlag: ${file.delFlag} (${file.delFlag === '0' ? '正常' : '已删除'})`);
        console.log(`   - createTime: ${file.createTime}`);
        console.log(`   - updateTime: ${file.updateTime}`);
    });

    // 3. 查询活跃文件（delFlag = '0'）
    const activeFiles = await prisma.sysUpload.findMany({
        where: {
            folderId,
            delFlag: '0',
        },
        select: {
            uploadId: true,
            fileName: true,
            createTime: true,
        },
    });

    console.log(`\n\n活跃文件 (delFlag='0', 共 ${activeFiles.length} 个):`);
    if (activeFiles.length > 0) {
        activeFiles.forEach((file, index) => {
            console.log(`${index + 1}. ${file.fileName} (ID: ${file.uploadId})`);
        });
    } else {
        console.log('没有活跃文件，文件夹应该可以删除');
    }

    // 4. 查询子文件夹
    const childFolders = await prisma.sysFileFolder.findMany({
        where: {
            parentId: folderId,
            delFlag: '0',
        },
        select: {
            folderId: true,
            folderName: true,
        },
    });

    console.log(`\n子文件夹 (共 ${childFolders.length} 个):`);
    if (childFolders.length > 0) {
        childFolders.forEach((child, index) => {
            console.log(`${index + 1}. ${child.folderName} (ID: ${child.folderId})`);
        });
    } else {
        console.log('没有子文件夹');
    }

    console.log('\n=====================================\n');

    await prisma.$disconnect();
}

checkFolderFiles().catch(console.error);
