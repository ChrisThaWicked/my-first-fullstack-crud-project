const express = require('express');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const app = express();
const port = 4000;
const cors = require('cors');

app.use(cors({
    origin: 'http://localhost:3000' 
}));

app.use(express.json());

app.post('/get-entries', async (req, res) => {
    const entries = await prisma.journalEntry.findMany({
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });
    res.json(entries.map(entry => ({
        ...entry,
        tags: entry.tags.map(et => et.tag.name)
    })));
});

app.post('/get-entry/:id', async (req, res) => {
    const { id } = req.params;
    const entry = await prisma.journalEntry.findUnique({
        where: { id: parseInt(id) },
        include: {
            tags: {
                include: {
                    tag: true
                }
            }
        }
    });
    if (entry) {
        res.json({
            ...entry,
            tags: entry.tags.map(et => et.tag.name)
        });
    } else {
        res.status(404).json({ error: 'Entry not found' });
    }
});

app.post('/add-entry', async (req, res) => {
    const { title, content, tags } = req.body;
    const createdEntry = await prisma.journalEntry.create({
        data: {
            title,
            content,
            tags: {
                create: tags.map(tag => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tag },
                            create: { name: tag }
                        }
                    }
                }))
            }
        }
    });
    res.json(createdEntry);
});

app.post('/update-entry/:id', async (req, res) => {
    const { id } = req.params;
    const { title, content, tags } = req.body;
    const updatedEntry = await prisma.journalEntry.update({
        where: { id: parseInt(id) },
        data: {
            title,
            content,
            tags: {
                deleteMany: {},
                create: tags.map(tag => ({
                    tag: {
                        connectOrCreate: {
                            where: { name: tag },
                            create: { name: tag }
                        }
                    }
                }))
            }
        }
    });
    res.json(updatedEntry);
});

app.post('/delete-entry/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Check if the journal entry exists
        const journalEntry = await prisma.journalEntry.findUnique({
            where: { id: parseInt(id) },
            include: { tags: true }, // Include related tags
        });

        // If the journal entry doesn't exist, return an error
        if (!journalEntry) {
            return res.status(404).json({ error: 'Journal entry not found' });
        }

        // Delete related entry tags first to avoid foreign key constraint violation
        await prisma.entryTag.deleteMany({
            where: { journalEntryId: parseInt(id) },
        });

        // Now delete the journal entry
        await prisma.journalEntry.delete({
            where: { id: parseInt(id) },
        });

        // Send success response
        res.status(200).json({ message: 'Journal entry deleted successfully' });
    } catch (error) {
        // Handle any errors
        console.error('Error deleting journal entry:', error);
        res.status(500).json({ error: 'Failed to delete journal entry' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});