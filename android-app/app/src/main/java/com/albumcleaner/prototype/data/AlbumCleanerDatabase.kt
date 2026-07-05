package com.albumcleaner.prototype.data

import android.content.Context
import androidx.room.Dao
import androidx.room.Database
import androidx.room.Entity
import androidx.room.Insert
import androidx.room.OnConflictStrategy
import androidx.room.PrimaryKey
import androidx.room.Query
import androidx.room.Room
import androidx.room.RoomDatabase

@Entity(tableName = "review_action")
data class ReviewActionEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val mediaId: Long,
    val action: String,
    val displayName: String,
    val uri: String,
    val createdAtMillis: Long
)

@Entity(tableName = "collection_folder")
data class CollectionFolderEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val name: String,
    val iconRes: String = "star",
    val coverUri: String = "",
    val sortOrder: Int = 0,
    val isDefault: Boolean = false,
    val createdAtMillis: Long = System.currentTimeMillis(),
    val updatedAtMillis: Long = System.currentTimeMillis()
)

@Entity(
    tableName = "collection_item",
    primaryKeys = ["collectionId", "mediaId"]
)
data class CollectionItemEntity(
    val collectionId: Long,
    val mediaId: Long,
    val displayName: String,
    val uri: String,
    val addedAtMillis: Long = System.currentTimeMillis()
)

@Entity(tableName = "staged_item")
data class StagedItemEntity(
    @PrimaryKey val mediaId: Long,
    val paletteIndex: Int,
    val uri: String,
    val displayName: String,
    val createdAtMillis: Long
)

@Entity(tableName = "user_settings")
data class UserSettingsEntity(
    @PrimaryKey val id: Int = 1,
    val actionBarEnabled: Boolean,
    val skipDeleteTip: Boolean,
    val darkMode: String = "system"
)

@Dao
interface ReviewActionDao {
    @Insert
    suspend fun insert(entity: ReviewActionEntity)

    @Insert
    suspend fun insertAll(entities: List<ReviewActionEntity>)

    @Query("SELECT * FROM review_action ORDER BY createdAtMillis ASC")
    suspend fun getAll(): List<ReviewActionEntity>

    @Query("SELECT * FROM review_action ORDER BY createdAtMillis DESC LIMIT :limit")
    suspend fun latest(limit: Int): List<ReviewActionEntity>

    @Query("SELECT COUNT(*) FROM review_action")
    suspend fun count(): Int

    @Query("DELETE FROM review_action WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM review_action")
    suspend fun clear()
}

@Dao
interface CollectionFolderDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: CollectionFolderEntity): Long

    @Query("SELECT * FROM collection_folder ORDER BY sortOrder ASC, createdAtMillis ASC")
    suspend fun getAll(): List<CollectionFolderEntity>

    @Query("SELECT * FROM collection_folder WHERE id = :id")
    suspend fun getById(id: Long): CollectionFolderEntity?

    @Query("SELECT * FROM collection_folder WHERE isDefault = 1 LIMIT 1")
    suspend fun getDefault(): CollectionFolderEntity?

    @Query("UPDATE collection_folder SET name = :name, updatedAtMillis = :updatedAt WHERE id = :id")
    suspend fun updateName(id: Long, name: String, updatedAt: Long)

    @Query("UPDATE collection_folder SET coverUri = :coverUri, updatedAtMillis = :updatedAt WHERE id = :id")
    suspend fun updateCover(id: Long, coverUri: String, updatedAt: Long)

    @Query("DELETE FROM collection_folder WHERE id = :id")
    suspend fun delete(id: Long)
}

@Dao
interface CollectionItemDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: CollectionItemEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsertAll(entities: List<CollectionItemEntity>)

    @Query("SELECT * FROM collection_item WHERE collectionId = :collectionId ORDER BY addedAtMillis DESC")
    suspend fun getByCollectionId(collectionId: Long): List<CollectionItemEntity>

    @Query("SELECT COUNT(*) FROM collection_item WHERE collectionId = :collectionId")
    suspend fun countByCollectionId(collectionId: Long): Int

    @Query("DELETE FROM collection_item WHERE collectionId = :collectionId AND mediaId = :mediaId")
    suspend fun remove(collectionId: Long, mediaId: Long)

    @Query("DELETE FROM collection_item WHERE collectionId = :collectionId")
    suspend fun clearByCollectionId(collectionId: Long)

    @Query("DELETE FROM collection_item WHERE mediaId = :mediaId")
    suspend fun removeFromAll(mediaId: Long)
}

@Dao
interface StagedItemDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: StagedItemEntity)

    @Query("SELECT * FROM staged_item ORDER BY createdAtMillis ASC")
    suspend fun getAll(): List<StagedItemEntity>

    @Query("DELETE FROM staged_item WHERE mediaId = :mediaId")
    suspend fun remove(mediaId: Long)

    @Query("DELETE FROM staged_item")
    suspend fun clear()
}

@Dao
interface UserSettingsDao {
    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun upsert(entity: UserSettingsEntity)

    @Query("SELECT * FROM user_settings WHERE id = 1")
    suspend fun get(): UserSettingsEntity?
}

@Database(
    entities = [
        ReviewActionEntity::class,
        CollectionFolderEntity::class,
        CollectionItemEntity::class,
        StagedItemEntity::class,
        UserSettingsEntity::class
    ],
    version = 4,
    exportSchema = false
)
abstract class AlbumCleanerDatabase : RoomDatabase() {
    abstract fun reviewActionDao(): ReviewActionDao
    abstract fun collectionFolderDao(): CollectionFolderDao
    abstract fun collectionItemDao(): CollectionItemDao
    abstract fun stagedItemDao(): StagedItemDao
    abstract fun userSettingsDao(): UserSettingsDao

    companion object {
        @Volatile
        private var instance: AlbumCleanerDatabase? = null

        fun get(context: Context): AlbumCleanerDatabase {
            return instance ?: synchronized(this) {
                instance ?: Room.databaseBuilder(
                    context.applicationContext,
                    AlbumCleanerDatabase::class.java,
                    "album_cleaner.db"
                )
                    .fallbackToDestructiveMigration()
                    .build()
                    .also { instance = it }
            }
        }
    }
}