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

@Entity(tableName = "decision_record")
data class DecisionRecordEntity(
    @PrimaryKey(autoGenerate = true) val id: Long = 0,
    val mediaId: Long,
    val action: String,
    val displayName: String,
    val uri: String,
    val createdAtMillis: Long
)

@Entity(tableName = "staged_item")
data class StagedItemEntity(
    @PrimaryKey val mediaId: Long,
    val paletteIndex: Int,
    val uri: String,
    val displayName: String,
    val createdAtMillis: Long
)

@Dao
interface DecisionRecordDao {
    @Insert
    suspend fun insert(entity: DecisionRecordEntity)

    @Query("SELECT * FROM decision_record ORDER BY createdAtMillis ASC")
    suspend fun getAll(): List<DecisionRecordEntity>

    @Query("SELECT * FROM decision_record ORDER BY createdAtMillis DESC LIMIT :limit")
    suspend fun latest(limit: Int): List<DecisionRecordEntity>

    @Query("SELECT COUNT(*) FROM decision_record")
    suspend fun count(): Int

    @Query("DELETE FROM decision_record WHERE id = :id")
    suspend fun deleteById(id: Long)

    @Query("DELETE FROM decision_record")
    suspend fun clear()
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

@Database(
    entities = [DecisionRecordEntity::class, StagedItemEntity::class],
    version = 2,
    exportSchema = false
)
abstract class AlbumCleanerDatabase : RoomDatabase() {
    abstract fun decisionRecordDao(): DecisionRecordDao
    abstract fun stagedItemDao(): StagedItemDao

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
